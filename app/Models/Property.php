<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'currency',
        'address',
        'type',
        'operation',
        'bedrooms',
        'bathrooms',
        'built_surface',
        'land_surface',
        'latitude',
        'longitude',
        'main_image',
        'study',
        'tv_room',
        'service_room',
        'meeting_room',
        'warehouse',
        'cistern',
        'pool',
        'jacuzzi',
        'gym',
        'event_room',
        'garage',
        'ramps',
        'grill',
        'air_conditioning',
        'fans',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'built_surface' => 'decimal:2',
        'land_surface' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'study' => 'boolean',
        'tv_room' => 'boolean',
        'service_room' => 'boolean',
        'meeting_room' => 'boolean',
        'warehouse' => 'boolean',
        'cistern' => 'boolean',
        'pool' => 'boolean',
        'jacuzzi' => 'boolean',
        'gym' => 'boolean',
        'event_room' => 'boolean',
        'garage' => 'boolean',
        'ramps' => 'boolean',
        'grill' => 'boolean',
        'air_conditioning' => 'boolean',
        'fans' => 'boolean',
    ];

    /**
     * Obtener el precio formateado
     */
    public function getFormattedPriceAttribute()
    {
        return number_format($this->price, 0, '.', ',') . ' ' . $this->currency;
    }

    /**
     * Obtener la URL de la imagen principal
     */
    public function getMainImageUrlAttribute()
    {
        return $this->main_image ? asset('storage/' . $this->main_image) : null;
    }

    /**
     * Scope para filtrar por tipo
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope para filtrar por operación
     */
    public function scopeForOperation($query, $operation)
    {
        return $query->where('operation', $operation);
    }

    /**
     * Scope para filtrar por rango de precio
     */
    public function scopePriceBetween($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    /**
     * Scope para buscar por dirección
     */
    public function scopeSearchByAddress($query, $address)
    {
        return $query->where('address', 'LIKE', '%' . $address . '%');
    }

    /**
     * Scope para filtrar por número mínimo de habitaciones
     */
    public function scopeMinBedrooms($query, $bedrooms)
    {
        return $query->where('bedrooms', '>=', $bedrooms);
    }

    /**
     * Scope para filtrar por número mínimo de baños
     */
    public function scopeMinBathrooms($query, $bathrooms)
    {
        return $query->where('bathrooms', '>=', $bathrooms);
    }
}