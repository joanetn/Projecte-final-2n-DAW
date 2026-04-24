<?php

namespace App\Modules\Notifications\Application\Services;

use App\Models\Usuari;
use App\Modules\Notifications\Domain\Entities\Notification;
use App\Modules\Notifications\Infrastructure\Mail\NotificationChannelMail;
use Illuminate\Support\Facades\Mail;

class NotificationEmailSender
{
    private const DEFAULT_RECIPIENT = 'notifications@example.com';

    public function send(Notification $notification, string $generatedMessage): array
    {
        [$subjectLine, $body] = $this->extractSubjectAndBody($generatedMessage, $notification->suceso);

        $recipient = $this->resolveRecipient($notification);

        $messageHtml = $this->formatMessageHtml($body);

        Mail::to($recipient)->send(new NotificationChannelMail(
            subjectLine: $subjectLine,
            suceso: $notification->suceso,
            urgencia: $notification->urgencia,
            messageHtml: $messageHtml,
            generatedAt: now()->toIso8601String(),
        ));

        return [
            'recipient' => $recipient,
            'subject' => $subjectLine,
            'sentAt' => now()->toIso8601String(),
        ];
    }

    private function resolveRecipient(Notification $notification): string
    {
        $userId = trim((string) ($notification->userId ?? ''));

        if ($userId !== '') {
            $userEmail = trim((string) (Usuari::query()->where('id', $userId)->value('email') ?? ''));
            if ($userEmail !== '') {
                return $userEmail;
            }
        }

        $fallback = trim((string) env('NOTIFICATIONS_EMAIL_RECIPIENT', self::DEFAULT_RECIPIENT));
        return $fallback !== '' ? $fallback : self::DEFAULT_RECIPIENT;
    }

    private function extractSubjectAndBody(string $generatedMessage, string $fallbackSubject): array
    {
        $raw = trim(str_replace("\r\n", "\n", $generatedMessage));

        if ($raw === '') {
            return [$this->fallbackSubject($fallbackSubject), 'Notificación sin contenido generado.'];
        }

        $subject = null;
        if (preg_match('/^\s*(Asunto|Subject)\s*:\s*(.+)$/mi', $raw, $matches) === 1) {
            $subject = trim((string) ($matches[2] ?? ''));
            $raw = preg_replace('/^\s*(Asunto|Subject)\s*:\s*.+$/mi', '', $raw, 1) ?? $raw;
        }

        $body = trim($raw);
        if ($body === '') {
            $body = $fallbackSubject;
        }

        return [
            $subject !== null && $subject !== '' ? $subject : $this->fallbackSubject($fallbackSubject),
            $body,
        ];
    }

    private function fallbackSubject(string $fallbackSubject): string
    {
        $trimmed = trim($fallbackSubject);
        return $trimmed !== '' ? $trimmed : 'Notificación de PadelPlay';
    }

    private function formatMessageHtml(string $body): string
    {
        $safe = e($body);

        // Negrita Markdown: **texto**
        $safe = preg_replace('/\*\*(.*?)\*\*/s', '<strong>$1</strong>', $safe) ?? $safe;

        // Cursiva Markdown: *texto*
        $safe = preg_replace('/(?<!\*)\*(?!\*)([^\*]+)\*(?!\*)/s', '<em>$1</em>', $safe) ?? $safe;

        return nl2br($safe);
    }
}
