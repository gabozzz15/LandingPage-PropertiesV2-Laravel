<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PropertyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('api')->group(function () {
    // API para obtener propiedades con filtros
    Route::get('/properties', [PropertyController::class, 'getProperties']);
    
    // API para obtener una propiedad específica
    Route::get('/properties/{id}', [PropertyController::class, 'show']);
    
    // API para obtener estadísticas
    Route::get('/stats', [PropertyController::class, 'getStats']);
});