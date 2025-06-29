<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
        'status'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeContacted($query)
    {
        return $query->where('status', 'contacted');
    }

    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
    }

    // Accessors
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'Pendiente',
            'contacted' => 'Contactado',
            'resolved' => 'Resuelto',
            default => 'Desconocido'
        };
    }

    // Static methods
    public static function getStatuses(): array
    {
        return [
            'pending' => 'Pendiente',
            'contacted' => 'Contactado',
            'resolved' => 'Resuelto'
        ];
    }
}