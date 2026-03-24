<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropostaCanviDataPartit extends Model
{
    use HasUuids;

    protected $table = 'proposta_canvi_data_partits';

    protected $fillable = [
        'id',
        'partitId',
        'equipProposaId',
        'equipReceptorId',
        'proposatPerUsuariId',
        'dataHoraProposada',
        'motiu',
        'estat',
        'respostaText',
        'respostaPerUsuariId',
        'respostaAt',
        'isActive',
    ];

    protected $casts = [
        'dataHoraProposada' => 'datetime',
        'respostaAt' => 'datetime',
        'isActive' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function partit(): BelongsTo
    {
        return $this->belongsTo(Partit::class, 'partitId');
    }

    public function equipProposa(): BelongsTo
    {
        return $this->belongsTo(Equip::class, 'equipProposaId');
    }

    public function equipReceptor(): BelongsTo
    {
        return $this->belongsTo(Equip::class, 'equipReceptorId');
    }

    public function proposatPerUsuari(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'proposatPerUsuariId');
    }

    public function respostaPerUsuari(): BelongsTo
    {
        return $this->belongsTo(Usuari::class, 'respostaPerUsuariId');
    }
}
