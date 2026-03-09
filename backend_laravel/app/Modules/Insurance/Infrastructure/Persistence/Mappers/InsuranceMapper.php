<?php

namespace App\Modules\Insurance\Infrastructure\Persistence\Mappers;

use App\Modules\Insurance\Domain\Entities\Insurance;
use App\Modules\Insurance\Infrastructure\Persistence\Eloquent\Models\InsuranceModel;

class InsuranceMapper
{
    public static function toDomain(InsuranceModel $model): Insurance
    {
        return new Insurance(
            id: $model->id,
            usuariId: $model->usuariId,
            dataExpiracio: $model->dataExpiracio?->format('Y-m-d H:i:s'),
            pagat: $model->pagat,
            stripe_payment_intent_id: $model->stripe_payment_intent_id,
            preu: $model->preu,
            mesos: $model->mesos ?? 12,
            createdAt: $model->created_at?->format('Y-m-d H:i:s'),
            updatedAt: $model->updated_at?->format('Y-m-d H:i:s'),
            isActive: $model->isActive,
        );
    }

    public static function toArray(Insurance $insurance, ?InsuranceModel $model = null): array
    {
        $data = [
            'id'                       => $insurance->id,
            'usuariId'                 => $insurance->usuariId,
            'dataExpiracio'            => $insurance->dataExpiracio,
            'pagat'                    => $insurance->pagat,
            'stripe_payment_intent_id' => $insurance->stripe_payment_intent_id,
            'preu'                     => $insurance->preu,
            'mesos'                    => $insurance->mesos,
            'isActive'                 => $insurance->isActive,
            'createdAt'                => $insurance->createdAt,
            'updatedAt'                => $insurance->updatedAt,
        ];

        // Inclou les dades de l'usuari si la relació s'ha carregat (with('usuari'))
        if ($model && $model->relationLoaded('usuari') && $model->usuari) {
            $data['usuari'] = [
                'id'     => $model->usuari->id,
                'nom'    => $model->usuari->nom,
                'email'  => $model->usuari->email,
                'avatar' => $model->usuari->avatar,
            ];
        }

        return $data;
    }
}
