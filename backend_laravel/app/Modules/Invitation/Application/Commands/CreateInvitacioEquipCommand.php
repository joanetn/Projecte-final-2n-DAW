<?php

namespace App\Modules\Invitation\Application\Commands;

use App\Modules\Notifications\Application\Commands\EnqueueNotificationCommand;
use App\Modules\Notifications\Application\Commands\ProcessNextCommand;
use App\Modules\Notifications\Application\DTOs\EnqueueNotificationDTO;
use App\Models\Equip;
use App\Models\Seguro;
use App\Models\Usuari;
use App\Modules\Invitation\Application\DTOs\CreateInvitacioEquipDTO;
use App\Modules\Invitation\Domain\Repositories\InvitacioEquipRepositoryInterface;
use App\Modules\Invitation\Domain\Services\InvitationDomainService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CreateInvitacioEquipCommand
{
    public function __construct(
        private InvitacioEquipRepositoryInterface $invitacioRepo,
        private InvitationDomainService $domainService,
        private EnqueueNotificationCommand $enqueueNotificationCommand,
        private ProcessNextCommand $processNextCommand,
    ) {}

    public function execute(CreateInvitacioEquipDTO $dto): string
    {
        if (!$this->hasPaidActiveInsurance($dto->usuariId)) {
            throw new \RuntimeException("L'usuari convidat ha de tenir el segur pagat i actiu", 422);
        }

        $existingInvitation = $this->invitacioRepo->findPendingByEquipAndUsuari($dto->equipId, $dto->usuariId);
        if ($existingInvitation !== null) {
            return $existingInvitation->id;
        }

        $invitacio = $this->invitacioRepo->create([
            'id' => Str::uuid()->toString(),
            'equipId' => $dto->equipId,
            'usuariId' => $dto->usuariId,
            'missatge' => $dto->missatge,
            'estat' => 'pendent',
            'isActive' => true,
        ]);

        $this->dispatchInvitationNotification($dto);

        return $invitacio->id;
    }

    private function dispatchInvitationNotification(CreateInvitacioEquipDTO $dto): void
    {
        try {
            $equipName = Equip::query()
                ->where('id', $dto->equipId)
                ->value('nom') ?? 'l\'equip';

            $inviterName = $dto->remitentId
                ? (Usuari::query()->where('id', $dto->remitentId)->value('nom') ?? 'Algú del club')
                : 'Algú del club';

            $customMessage = trim((string) ($dto->missatge ?? ''));

            $suceso = $customMessage !== ''
                ? "{$inviterName} t'ha convidat a unir-te a {$equipName}. Missatge: {$customMessage}"
                : "{$inviterName} t'ha convidat a unir-te a {$equipName}.";

            $forceWhatsappTest = $this->isForcedInvitationWhatsappTestEnabled();
            $forcedPhone = trim((string) env('INVITATION_FORCE_WHATSAPP_PHONE', ''));

            $contentSid = trim((string) env('INVITATION_FORCE_WHATSAPP_CONTENT_SID', ''));
            if ($contentSid === '') {
                $contentSid = 'HXb5b62575e6e4ff6129ad7c8efe1f983e';
            }

            $contentVariables = $this->decodeTemplateVariables(
                env('INVITATION_FORCE_WHATSAPP_CONTENT_VARIABLES', '{"1":"12/1","2":"3pm"}')
            );

            $channels = $forceWhatsappTest
                ? ['WhatsApp']
                : ['Push', 'Email'];

            $notificationData = [
                'type' => 'invitacio_equip',
                'equipNom' => $equipName,
                'remitentNom' => $inviterName,
                'missatgeOriginal' => $customMessage !== '' ? $customMessage : null,
            ];

            if ($forceWhatsappTest && $forcedPhone !== '') {
                $notificationData['whatsapp_phone'] = $forcedPhone;
            }

            if ($forceWhatsappTest && $contentSid !== '') {
                $notificationData['twilio_content_sid'] = $contentSid;

                if (!empty($contentVariables)) {
                    $notificationData['twilio_content_variables'] = $contentVariables;
                }
            }

            $enqueueDto = EnqueueNotificationDTO::fromArray([
                'userId' => $dto->usuariId,
                'suceso' => $suceso,
                'channels' => $channels,
                'tone' => 'PROFESIONAL',
                'data' => $notificationData,
            ]);

            $this->enqueueNotificationCommand->execute($enqueueDto);

            $this->processNextCommand->execute();
        } catch (\Throwable $e) {
            Log::error('Error enviando notificación de invitación de equipo', [
                'equipId' => $dto->equipId,
                'usuariId' => $dto->usuariId,
                'remitentId' => $dto->remitentId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function hasPaidActiveInsurance(string $usuariId): bool
    {
        return Seguro::query()
            ->where('usuariId', $usuariId)
            ->where('isActive', true)
            ->where('pagat', true)
            ->where(function ($query) {
                $query
                    ->whereNull('dataExpiracio')
                    ->orWhere('dataExpiracio', '>=', now());
            })
            ->exists();
    }

    private function isForcedInvitationWhatsappTestEnabled(): bool
    {
        return filter_var(
            (string) env('INVITATION_FORCE_WHATSAPP_TEST', 'true'),
            FILTER_VALIDATE_BOOL
        ) === true;
    }

    /**
     * @return array<string, mixed>
     */
    private function decodeTemplateVariables(mixed $raw): array
    {
        if (is_array($raw)) {
            return $raw;
        }

        if (is_string($raw)) {
            $trimmed = trim($raw);
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
}
