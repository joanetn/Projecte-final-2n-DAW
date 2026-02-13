<?php
namespace App\Modules\Lineup\Infrastructure\Persistence\Eloquent\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class PartitJugadorModel extends Model
{
    use HasUuids;
    protected $table = 'partit_jugadors';
    public $timestamps = false;
    protected $fillable = [
        'id',
        'partitId',
        'jugadorId',
        'equipId',
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
    public function equip(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Equip::class, 'equipId');
    }
}
