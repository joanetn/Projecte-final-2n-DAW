<?php

namespace App\Modules\Notifications\Application\Services;

use App\Models\Usuari;
use App\Modules\Notifications\Domain\Entities\Notification;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class NotificationSmsSender
{
    public function send(Notification $notification, string $generatedMessage, ?string $channelOverride = null): array
    {
        $recipient = $this->resolveRecipientFromNotification($notification);
        $contentSid = trim((string) ($notification->data['twilio_content_sid'] ?? $notification->data['contentSid'] ?? ''));
        $contentVariables = $this->normalizeContentVariables(
            $notification->data['twilio_content_variables']
                ?? $notification->data['contentVariables']
                ?? []
        );

        return $this->sendDirect(
            $recipient,
            $generatedMessage,
            $notification->id,
            $contentSid !== '' ? $contentSid : null,
            $contentVariables,
            $channelOverride
        );
    }

    public function sendDirect(
        string $phone,
        string $message,
        ?string $referenceId = null,
        ?string $contentSid = null,
        array $contentVariables = [],
        ?string $channelOverride = null,
    ): array {
        $config = $this->resolveConfig($channelOverride);
        $recipient = $this->normalizeRecipient($phone, $config['default_country_code'], $config['channel']);
        $body = $this->normalizeMessageBody($message, $config['channel'], $contentSid);

        $endpoint = rtrim($config['base_url'], '/')
            . '/2010-04-01/Accounts/'
            . $config['account_sid']
            . '/Messages.json';

        $payload = [
            'To' => $recipient,
        ];

        if ($body !== '') {
            $payload['Body'] = $body;
        }

        // $trimmedContentSid = trim((string) $contentSid);
        // if ($trimmedContentSid !== '') {
        //     $payload['ContentSid'] = $trimmedContentSid;

        //     if (!empty($contentVariables)) {
        //         $encodedContentVariables = json_encode(
        //             $contentVariables,
        //             JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        //         );

        //         if ($encodedContentVariables === false) {
        //             throw new \RuntimeException('No se pudieron serializar contentVariables para Twilio.');
        //         }

        //         $payload['ContentVariables'] = $encodedContentVariables;
        //     }
        // }

        if ($config['messaging_service_sid'] !== '') {
            $payload['MessagingServiceSid'] = $config['messaging_service_sid'];
        } else {
            $payload['From'] = $this->normalizeFromNumber(
                $config['from_number'],
                $config['default_country_code'],
                $config['channel']
            );
        }

        /** @var Response $response */
        $response = Http::withBasicAuth($config['account_sid'], $config['auth_token'])
            ->acceptJson()
            ->asForm()
            ->timeout($config['timeout'])
            ->retry($config['retries'], $config['retry_sleep_ms'])
            ->post($endpoint, $payload);

        if (!$response->successful()) {
            throw new \RuntimeException(sprintf(
                'Error enviando notificación Twilio (%d): %s',
                $response->status(),
                $response->body()
            ));
        }

        $responsePayload = $response->json();

        return [
            'recipient' => $recipient,
            'messageId' => data_get($responsePayload, 'sid'),
            'status' => data_get($responsePayload, 'status'),
            'referenceId' => $referenceId,
            'sentAt' => now()->toIso8601String(),
            'provider' => $config['channel'] === 'whatsapp' ? 'twilio_whatsapp' : 'twilio_sms',
            'channel' => $config['channel'],
            'response' => $responsePayload,
        ];
    }

    private function resolveRecipientFromNotification(Notification $notification): string
    {
        $dataPhone = $this->extractPhoneFromData($notification->data);
        if ($dataPhone !== '') {
            return $dataPhone;
        }

        $userId = trim((string) ($notification->userId ?? ''));
        if ($userId !== '') {
            $userPhone = trim((string) (Usuari::query()->where('id', $userId)->value('telefon') ?? ''));
            if ($userPhone !== '') {
                return $userPhone;
            }
        }

        $fallbackRecipient = trim((string) config('services.sms_twilio.fallback_recipient', ''));
        if ($fallbackRecipient !== '') {
            return $fallbackRecipient;
        }

        throw new \RuntimeException('No se ha encontrado teléfono destino para SMS.');
    }

    private function extractPhoneFromData(array $data): string
    {
        $candidateKeys = [
            'whatsapp_phone',
            'whatsappPhone',
            'sms_phone',
            'smsPhone',
            'phone',
            'telefon',
            'to',
        ];

        foreach ($candidateKeys as $key) {
            $value = trim((string) ($data[$key] ?? ''));
            if ($value !== '') {
                return $value;
            }
        }

        return '';
    }

    private function normalizeRecipient(string $phone, string $defaultCountryCode, string $channel): string
    {
        $e164 = $this->normalizeE164($phone, $defaultCountryCode, 'destino');

        return $this->applyChannelPrefix($e164, $channel);
    }

    private function normalizeFromNumber(string $fromNumber, string $defaultCountryCode, string $channel): string
    {
        $trimmed = trim($fromNumber);
        if ($trimmed === '') {
            throw new \RuntimeException('El número de origen Twilio está vacío o es inválido.');
        }

        if ($channel === 'whatsapp' && str_starts_with(strtolower($trimmed), 'whatsapp:+')) {
            return $trimmed;
        }

        $e164 = $this->normalizeE164($trimmed, $defaultCountryCode, 'origen');

        return $this->applyChannelPrefix($e164, $channel);
    }

    private function normalizeE164(string $phone, string $defaultCountryCode, string $role): string
    {
        $trimmed = trim($phone);
        $withoutChannelPrefix = preg_replace('/^whatsapp:/i', '', $trimmed) ?? $trimmed;
        $withoutChannelPrefix = trim($withoutChannelPrefix);

        $hasPlusPrefix = str_starts_with($withoutChannelPrefix, '+');
        $clean = preg_replace('/\D+/', '', $withoutChannelPrefix) ?? '';

        if (str_starts_with($clean, '00')) {
            $clean = substr($clean, 2);
            $hasPlusPrefix = true;
        }

        if ($clean === '') {
            throw new \RuntimeException(sprintf('El teléfono %s está vacío o es inválido.', $role));
        }

        if (!$hasPlusPrefix && strlen($clean) <= 9) {
            $countryCode = preg_replace('/\D+/', '', $defaultCountryCode) ?? '';

            if ($countryCode !== '') {
                $clean = $countryCode . ltrim($clean, '0');
            }
        }

        if (strlen($clean) < 8 || strlen($clean) > 15) {
            throw new \RuntimeException(sprintf(
                'El teléfono %s debe estar en formato internacional E.164 (8-15 dígitos).',
                $role
            ));
        }

        return '+' . $clean;
    }

    private function applyChannelPrefix(string $e164, string $channel): string
    {
        if ($channel === 'whatsapp') {
            return 'whatsapp:' . $e164;
        }

        return $e164;
    }

    private function normalizeMessageBody(string $message, string $channel, ?string $contentSid): string
    {
        $body = trim(str_replace("\r\n", "\n", $message));
        $hasTemplateSid = trim((string) $contentSid) !== '';

        if ($body === '' && !$hasTemplateSid) {
            throw new \RuntimeException('El mensaje Twilio está vacío.');
        }

        // Limitamos solo cuando el canal es SMS para mantener compatibilidad estándar.
        if ($channel === 'sms' && mb_strlen($body) > 160) {
            $body = mb_substr($body, 0, 160);
        }

        return $body;
    }

    private function normalizeContentVariables(mixed $contentVariables): array
    {
        if (is_array($contentVariables)) {
            return $contentVariables;
        }

        if (is_string($contentVariables)) {
            $trimmed = trim($contentVariables);
            if ($trimmed === '') {
                return [];
            }

            $decoded = json_decode($trimmed, true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return [];
    }

    /**
     * @return array<string, mixed>
     */
    private function resolveConfig(?string $channelOverride = null): array
    {
        $enabled = (bool) config('services.sms_twilio.enabled', false);
        if (!$enabled) {
            throw new \RuntimeException('Twilio está deshabilitado. Activa SMS_TWILIO_ENABLED=true.');
        }

        $channel = $channelOverride !== null
            ? $this->normalizeChannel($channelOverride)
            : $this->normalizeChannel((string) config('services.sms_twilio.channel', 'sms'));

        $accountSid = trim((string) config('services.sms_twilio.account_sid', ''));
        $authToken = trim((string) config('services.sms_twilio.auth_token', ''));
        $fromNumber = trim((string) config('services.sms_twilio.from_number', ''));
        $messagingServiceSid = trim((string) config('services.sms_twilio.messaging_service_sid', ''));

        if ($accountSid === '' || $authToken === '') {
            throw new \RuntimeException('Falta configurar SMS_TWILIO_ACCOUNT_SID o SMS_TWILIO_AUTH_TOKEN.');
        }

        if ($messagingServiceSid === '' && $fromNumber === '') {
            throw new \RuntimeException('Configura SMS_TWILIO_FROM_NUMBER o SMS_TWILIO_MESSAGING_SERVICE_SID.');
        }

        return [
            'base_url' => trim((string) config('services.sms_twilio.base_url', 'https://api.twilio.com')),
            'account_sid' => $accountSid,
            'auth_token' => $authToken,
            'from_number' => $fromNumber,
            'messaging_service_sid' => $messagingServiceSid,
            'channel' => $channel,
            'default_country_code' => (string) config('services.sms_twilio.default_country_code', '34'),
            'timeout' => (int) config('services.sms_twilio.timeout', 15),
            'retries' => (int) config('services.sms_twilio.retries', 1),
            'retry_sleep_ms' => (int) config('services.sms_twilio.retry_sleep_ms', 200),
        ];
    }

    private function normalizeChannel(string $channel): string
    {
        $normalized = strtolower(trim($channel));
        if ($normalized === '') {
            return 'sms';
        }

        if (!in_array($normalized, ['sms', 'whatsapp'], true)) {
            throw new \RuntimeException('SMS_TWILIO_CHANNEL debe ser sms o whatsapp.');
        }

        return $normalized;
    }
}
