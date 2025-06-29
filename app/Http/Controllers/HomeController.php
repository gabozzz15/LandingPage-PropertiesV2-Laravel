<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        // Get featured properties for the slider and main section
        $featuredProperties = Property::available()
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        // Get statistics
        $stats = [
            'total_properties' => Property::available()->count(),
            'properties_for_sale' => Property::available()->byOperation('venta')->count(),
            'properties_for_rent' => Property::available()->byOperation('renta')->count(),
            'cities' => Property::available()->distinct('address')->count('address'),
        ];

        // Get property types and operations for filters
        $propertyTypes = Property::getTypes();
        $operations = Property::getOperations();
        $amenities = Property::getAmenities();

        return view('home.index', compact(
            'featuredProperties',
            'stats',
            'propertyTypes',
            'operations',
            'amenities'
        ));
    }

    public function about()
    {
        return view('home.about');
    }

    public function contact()
    {
        return view('home.contact');
    }
}