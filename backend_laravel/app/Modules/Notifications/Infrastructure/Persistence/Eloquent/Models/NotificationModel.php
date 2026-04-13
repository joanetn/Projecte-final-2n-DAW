<?php

namespace App\Modules\Notifications\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NotificationModel extends Model
{
    protected $table = 'notificacions';

    protected $fillable = [
        'id',
        'user_id',
        'suceso',
        'channels',
        'tone',
        'urgencia',
        'data',
        'status',
        'llegit',
    ];

    protected $casts = [
        'channels' => 'array',
        'data' => 'array',
        'llegit' => 'boolean',
    ];

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }
}
