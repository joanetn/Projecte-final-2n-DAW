<?php
namespace App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class PuntuacioModel extends Model
{
    use HasUuids;
    protected $table = 'puntuacions';
    public $timestamps = false;
    protected $fillable = [
        'id',
        'partitId',
        'jugadorId',
        'punts',
        'isActive',
    ];
    protected $casts = [
        'punts' => 'integer',
        'isActive' => 'boolean',
    ];
    public function partit(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Partit::class, 'partitId');
    }
    public function jugador(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Usuari::class, 'jugadorId');
    }
}
