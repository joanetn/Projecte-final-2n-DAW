<?php

namespace App\Modules\Auth\Infrastructure\Persistence\Mappers;

use App\Modules\Auth\Domain\Entities\RefreshSession;
use App\Modules\Auth\Infrastructure\Persistence\Eloquent\Models\RefreshSessionModel;

class RefreshSessionMapper
{
    public static function toDomain(RefreshSessionModel $model): RefreshSession
    {
        return new RefreshSession(
            id: $model->id,
            user_id: $model->user_id,
            device_id: $model->device_id,
            device_type: $model->device_type,
            browser: $model->browser,
            os: $model->os,
            family_id: $model->family_id,
            current_token_hash: $model->current_token_hash,
            revoked: $model->revoked,
            session_version: $model->session_version,
            last_used_at: $model->last_used_at?->format('Y-m-d H:i:s'),
            createdAt: $model->created_at?->format('Y-m-d H:i:s'),
            updatedAt: $model->updated_at?->format('Y-m-d H:i:s'),
        );
    }

    public static function toArray(RefreshSession $session): array
    {
        return [
            'id' => $session->id,
            'user_id' => $session->user_id,
            'device_id' => $session->device_id,
            'device_type' => $session->device_type,
            'browser' => $session->browser,
            'os' => $session->os,
            'family_id' => $session->family_id,
            'current_token_hash' => $session->current_token_hash,
            'revoked' => $session->revoked,
            'session_version' => $session->session_version,
            'last_used_at' => $session->last_used_at,
        ];
    }
}
