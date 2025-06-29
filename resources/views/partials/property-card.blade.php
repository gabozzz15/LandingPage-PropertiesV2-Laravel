@php
    $amenities = App\Models\Property::getAmenities();
    $activeAmenities = collect($amenities)->filter(function($amenity, $key) use ($property) {
        return $property->$key;
    });
    $displayAmenities = $activeAmenities->take(3);
    $imageSrc = $property->main_image ?: "https://source.unsplash.com/800x600/?" . urlencode($property->type) . ",house";
@endphp

<div class="col-md-6 col-lg-4 mb-4" data-aos="fade-up">
    <div class="card property-card h-100">
        <div class="position-relative">
            <img src="{{ $imageSrc }}" class="card-img-top" alt="{{ $property->title }}">
            <span class="operation-badge operation-{{ $property->operation }}">{{ strtoupper($property->operation) }}</span>
            <button class="favorite-btn" data-id="{{ $property->id }}">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ $property->title }}</h5>
            <p class="price-tag">{{ $property->formatted_price }}</p>
            <p class="card-text text-muted mb-3">
                <i class="fas fa-map-marker-alt me-2"></i>{{ $property->address }}
            </p>
            <div class="property-details">
                @if($property->bedrooms > 0)
                    <span class="detail-badge">
                        <i class="fas fa-bed"></i> {{ $property->bedrooms }} Hab
                    </span>
                @endif
                @if($property->bathrooms > 0)
                    <span class="detail-badge">
                        <i class="fas fa-bath"></i> {{ $property->bathrooms }} Baños
                    </span>
                @endif
                @if($property->built_surface > 0)
                    <span class="detail-badge">
                        <i class="fas fa-ruler"></i> {{ $property->built_surface }}m²
                    </span>
                @endif
            </div>
            <div class="amenities-container mt-auto">
                @foreach($displayAmenities as $key => $amenity)
                    <span class="amenity-badge">
                        <i class="fas {{ $amenity['icon'] }} me-1"></i> {{ $amenity['name'] }}
                    </span>
                @endforeach
                @if($activeAmenities->count() > 3)
                    <span class="amenity-badge">
                        <i class="fas fa-plus-circle me-1"></i> {{ $activeAmenities->count() - 3 }} más
                    </span>
                @endif
            </div>
            <div class="mt-3">
                <button class="btn btn-primary w-100" onclick="showPropertyDetails({{ $property->id }})">
                    <i class="fas fa-info-circle me-2"></i>Ver detalles
                </button>
            </div>
        </div>
    </div>
</div>