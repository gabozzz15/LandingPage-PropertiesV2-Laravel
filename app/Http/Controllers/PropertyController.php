<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;
use Illuminate\Support\Facades\DB;

class PropertyController extends Controller
{
    /**
     * Mostrar la página principal con propiedades
     */
    public function index()
    {
        return view('properties.index');
    }

    /**
     * API para obtener propiedades con filtros
     */
    public function getProperties(Request $request)
    {
        try {
            $query = Property::query();

            // Filtro por tipo de propiedad
            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            // Filtro por operación (venta/renta)
            if ($request->filled('operation')) {
                $query->where('operation', $request->operation);
            }

            // Filtro por rango de precio
            if ($request->filled('price_min')) {
                $query->where('price', '>=', $request->price_min);
            }

            if ($request->filled('price_max')) {
                $query->where('price', '<=', $request->price_max);
            }

            // Filtro por dirección
            if ($request->filled('address')) {
                $query->where('address', 'LIKE', '%' . $request->address . '%');
            }

            // Filtro por número de habitaciones
            if ($request->filled('bedrooms')) {
                $query->where('bedrooms', '>=', $request->bedrooms);
            }

            // Filtro por número de baños
            if ($request->filled('bathrooms')) {
                $query->where('bathrooms', '>=', $request->bathrooms);
            }

            // Filtros por amenidades
            $amenities = [
                'study', 'tv_room', 'service_room', 'meeting_room', 'warehouse',
                'cistern', 'pool', 'jacuzzi', 'gym', 'event_room',
                'garage', 'ramps', 'grill', 'air_conditioning', 'fans'
            ];

            foreach ($amenities as $amenity) {
                if ($request->filled($amenity) && $request->$amenity == '1') {
                    $query->where($amenity, true);
                }
            }

            // Obtener propiedades
            $properties = $query->get();

            // Formatear propiedades para la respuesta
            $formattedProperties = $properties->map(function ($property) {
                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'description' => $property->description,
                    'price' => $property->price,
                    'formatted_price' => $this->formatPrice($property->price, $property->currency),
                    'currency' => $property->currency,
                    'address' => $property->address,
                    'type' => $property->type,
                    'operation' => $property->operation,
                    'bedrooms' => $property->bedrooms,
                    'bathrooms' => $property->bathrooms,
                    'built_surface' => $property->built_surface,
                    'land_surface' => $property->land_surface,
                    'latitude' => $property->latitude,
                    'longitude' => $property->longitude,
                    'main_image' => $property->main_image ? asset('storage/' . $property->main_image) : null,
                    'created_at' => $property->created_at,
                    // Amenidades
                    'study' => $property->study,
                    'tv_room' => $property->tv_room,
                    'service_room' => $property->service_room,
                    'meeting_room' => $property->meeting_room,
                    'warehouse' => $property->warehouse,
                    'cistern' => $property->cistern,
                    'pool' => $property->pool,
                    'jacuzzi' => $property->jacuzzi,
                    'gym' => $property->gym,
                    'event_room' => $property->event_room,
                    'garage' => $property->garage,
                    'ramps' => $property->ramps,
                    'grill' => $property->grill,
                    'air_conditioning' => $property->air_conditioning,
                    'fans' => $property->fans,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedProperties,
                'total' => $formattedProperties->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener las propiedades: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener una propiedad específica
     */
    public function show($id)
    {
        try {
            $property = Property::findOrFail($id);

            $formattedProperty = [
                'id' => $property->id,
                'title' => $property->title,
                'description' => $property->description,
                'price' => $property->price,
                'formatted_price' => $this->formatPrice($property->price, $property->currency),
                'currency' => $property->currency,
                'address' => $property->address,
                'type' => $property->type,
                'operation' => $property->operation,
                'bedrooms' => $property->bedrooms,
                'bathrooms' => $property->bathrooms,
                'built_surface' => $property->built_surface,
                'land_surface' => $property->land_surface,
                'latitude' => $property->latitude,
                'longitude' => $property->longitude,
                'main_image' => $property->main_image ? asset('storage/' . $property->main_image) : null,
                'created_at' => $property->created_at,
                // Amenidades
                'study' => $property->study,
                'tv_room' => $property->tv_room,
                'service_room' => $property->service_room,
                'meeting_room' => $property->meeting_room,
                'warehouse' => $property->warehouse,
                'cistern' => $property->cistern,
                'pool' => $property->pool,
                'jacuzzi' => $property->jacuzzi,
                'gym' => $property->gym,
                'event_room' => $property->event_room,
                'garage' => $property->garage,
                'ramps' => $property->ramps,
                'grill' => $property->grill,
                'air_conditioning' => $property->air_conditioning,
                'fans' => $property->fans,
            ];

            return response()->json([
                'success' => true,
                'data' => $formattedProperty
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Propiedad no encontrada'
            ], 404);
        }
    }

    /**
     * Formatear precio
     */
    private function formatPrice($price, $currency = 'USD')
    {
        $locale = $currency === 'USD' ? 'en_US' : 'es_MX';
        
        return number_format($price, 0, '.', ',') . ' ' . $currency;
    }

    /**
     * Obtener estadísticas para la página principal
     */
    public function getStats()
    {
        try {
            $stats = [
                'total_properties' => Property::count(),
                'properties_for_sale' => Property::where('operation', 'venta')->count(),
                'properties_for_rent' => Property::where('operation', 'renta')->count(),
                'cities' => Property::distinct('address')->count(),
                'years_experience' => 15, // Valor fijo
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener estadísticas'
            ], 500);
        }
    }
}