@extends('layouts.app')

@section('title', 'LandingProperties - Tu portal inmobiliario')
@section('description', 'Encuentra tu propiedad ideal en LandingProperties. Casas, departamentos, terrenos y más en las mejores ubicaciones.')

@section('content')
    <!-- Hero Slider Section -->
    <section class="hero-slider">
        <div class="list">
            @foreach($featuredProperties->take(3) as $index => $property)
            <div class="item {{ $index === 0 ? 'active' : '' }}">
                <img src="{{ $property->main_image ?: 'https://source.unsplash.com/1920x1080/?house,property' }}" alt="{{ $property->title }}">
                <div class="content-header-slider">
                    <p>{{ ucfirst($property->operation) }}</p>
                    <h1>{{ $property->title }}</h1>
                    <p>{{ Str::limit($property->description, 100) }}</p>
                    <div class="hero-buttons">
                        <a href="#propiedades" class="btn btn-light btn-lg">
                            <i class="fas fa-search me-2"></i>Ver propiedades
                        </a>
                        <a href="{{ route('contact') }}" class="btn btn-outline-light btn-lg">
                            <i class="fas fa-envelope me-2"></i>Contactar
                        </a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
        <div class="arrows">
            <button id="hero-prev"><i class="fas fa-chevron-left"></i></button>
            <button id="hero-next"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="thumbnail">
            @foreach($featuredProperties->take(3) as $index => $property)
            <div class="item {{ $index === 0 ? 'active' : '' }}">
                <img src="{{ $property->main_image ?: 'https://source.unsplash.com/300x200/?house,property' }}" alt="{{ $property->title }}">
            </div>
            @endforeach
        </div>
    </section>

    <!-- Main Content -->
    <div class="container mt-5" id="propiedades">
        <div class="row mb-4">
            <div class="col-12 text-center" data-aos="fade-up">
                <h2 class="mb-3">Propiedades Destacadas</h2>
                <p class="text-muted">Explora nuestra selección de propiedades exclusivas</p>
            </div>
        </div>
        
        <div class="row">
            <!-- Filtros -->
            <div class="col-lg-3" data-aos="fade-right">
                <div class="filters-sidebar">
                    <h4><i class="fas fa-filter"></i> Filtros</h4>
                    <form id="filterForm">
                        @csrf
                        <div class="mb-3">
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-search"></i></span>
                                <input type="text" class="form-control" id="searchAddress" name="direccion" placeholder="Buscar por dirección">
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label"><i class="fas fa-house"></i> Tipo de Propiedad</label>
                            <select class="form-select" id="propertyType" name="tipo">
                                <option value="">Todos</option>
                                @foreach($propertyTypes as $key => $label)
                                    <option value="{{ $key }}">{{ $label }}</option>
                                @endforeach
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label"><i class="fas fa-tag"></i> Operación</label>
                            <select class="form-select" id="operationType" name="operacion">
                                <option value="">Todos</option>
                                @foreach($operations as $key => $label)
                                    <option value="{{ $key }}">{{ $label }}</option>
                                @endforeach
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label"><i class="fas fa-dollar-sign"></i> Rango de Precio</label>
                            <div class="input-group mb-2">
                                <span class="input-group-text">Min</span>
                                <input type="number" class="form-control" id="minPrice" name="precio_min" placeholder="Mínimo">
                            </div>
                            <div class="input-group">
                                <span class="input-group-text">Max</span>
                                <input type="number" class="form-control" id="maxPrice" name="precio_max" placeholder="Máximo">
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label"><i class="fas fa-bed"></i> Habitaciones</label>
                            <select class="form-select" id="habitaciones" name="habitaciones">
                                <option value="">Cualquiera</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5+</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label"><i class="fas fa-bath"></i> Baños</label>
                            <select class="form-select" id="banos" name="banos">
                                <option value="">Cualquiera</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                            </select>
                        </div>

                        <div class="amenities-section mb-3">
                            <label class="form-label"><i class="fas fa-star"></i> Amenidades</label>
                            <div class="row">
                                @php $amenityCount = 0; @endphp
                                @foreach($amenities as $key => $amenity)
                                    @if($amenityCount % 2 === 0)
                                        @if($amenityCount > 0)</div>@endif
                                        <div class="col-6">
                                    @endif
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="{{ $key }}" name="{{ $key }}">
                                        <label class="form-check-label" for="{{ $key }}">{{ $amenity['name'] }}</label>
                                    </div>
                                    @php $amenityCount++; @endphp
                                @endforeach
                                </div>
                            </div>
                        </div>

                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-primary" onclick="applyFilters()">
                                <i class="fas fa-search me-2"></i>Buscar
                            </button>
                            <button type="button" class="btn btn-outline-secondary" onclick="clearFilters()">
                                <i class="fas fa-times me-2"></i>Limpiar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Properties List -->
            <div class="col-lg-9" data-aos="fade-left">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <span id="propertyCount">{{ $featuredProperties->count() }}</span> propiedades encontradas
                    </div>
                    <div class="d-flex align-items-center">
                        <label class="me-2">Ordenar por:</label>
                        <select class="form-select form-select-sm" id="sortOrder" style="width: auto;">
                            <option value="recientes">Más recientes</option>
                            <option value="precio_asc">Precio: Menor a mayor</option>
                            <option value="precio_desc">Precio: Mayor a menor</option>
                        </select>
                    </div>
                </div>

                <div id="propertiesContainer" class="row">
                    @foreach($featuredProperties as $property)
                        @include('partials.property-card', ['property' => $property])
                    @endforeach
                </div>

                <!-- Pagination -->
                <div id="paginationContainer" class="d-flex justify-content-center mt-4">
                    <!-- Pagination will be handled by JavaScript -->
                </div>
            </div>
        </div>
    </div>

    <!-- Map Section -->
    <section class="map-section py-5 bg-light" id="mapa">
        <div class="container">
            <div class="row mb-4">
                <div class="col-12 text-center" data-aos="fade-up">
                    <h2 class="mb-3">Ubicaciones de Propiedades</h2>
                    <p class="text-muted">Explora las propiedades en el mapa interactivo</p>
                </div>
            </div>
            <div class="row">
                <div class="col-12" data-aos="fade-up" data-aos-delay="200">
                    <div id="map" style="height: 500px; border-radius: 15px;"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section py-5">
        <div class="container">
            <div class="row text-center">
                <div class="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="100">
                    <div class="stat-item">
                        <i class="fas fa-home stat-icon"></i>
                        <h3 class="counter" data-count="{{ $stats['total_properties'] }}">0</h3>
                        <p>Propiedades</p>
                    </div>
                </div>
                <div class="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="200">
                    <div class="stat-item">
                        <i class="fas fa-users stat-icon"></i>
                        <h3 class="counter" data-count="500">0</h3>
                        <p>Clientes Satisfechos</p>
                    </div>
                </div>
                <div class="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="300">
                    <div class="stat-item">
                        <i class="fas fa-map-marker-alt stat-icon"></i>
                        <h3 class="counter" data-count="{{ $stats['cities'] }}">0</h3>
                        <p>Ciudades</p>
                    </div>
                </div>
                <div class="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="400">
                    <div class="stat-item">
                        <i class="fas fa-calendar-alt stat-icon"></i>
                        <h3 class="counter" data-count="10">0</h3>
                        <p>Años de Experiencia</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section py-5 bg-light" id="contacto">
        <div class="container">
            <div class="row mb-5">
                <div class="col-12 text-center" data-aos="fade-up">
                    <h2 class="mb-3">Contáctanos</h2>
                    <p class="text-muted">¿Tienes alguna pregunta? Estamos aquí para ayudarte</p>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-8 mx-auto" data-aos="fade-up" data-aos-delay="200">
                    <form id="contactForm" class="contact-form">
                        @csrf
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="contactName" class="form-label">Nombre completo *</label>
                                <input type="text" class="form-control" id="contactName" name="name" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="contactEmail" class="form-label">Correo electrónico *</label>
                                <input type="email" class="form-control" id="contactEmail" name="email" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="contactPhone" class="form-label">Teléfono</label>
                            <input type="tel" class="form-control" id="contactPhone" name="phone">
                        </div>
                        <div class="mb-3">
                            <label for="contactMessage" class="form-label">Mensaje *</label>
                            <textarea class="form-control" id="contactMessage" name="message" rows="5" required></textarea>
                        </div>
                        <div class="text-center">
                            <button type="submit" class="btn btn-primary btn-lg">
                                <i class="fas fa-paper-plane me-2"></i>Enviar Mensaje
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
@endsection

@push('scripts')
<script>
    // Update API endpoints for Laravel routes
    const API_ENDPOINTS = {
        properties: '{{ route("api.properties.index") }}',
        contact: '{{ route("api.contact.store") }}',
        propertyDetails: '{{ url("api/properties") }}'
    };
</script>
@endpush