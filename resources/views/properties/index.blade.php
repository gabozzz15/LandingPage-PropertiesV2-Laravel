<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LandingProperties - Tu portal inmobiliario</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- AOS Animation Library -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="{{ asset('resources/css/styles.css') }}">
    <!-- Slider CSS -->
    <link rel="stylesheet" href="{{ asset('resources/css/slider.css') }}">
</head>
<body>
    <!-- Navbar mejorado -->
    <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
        <div class="container">
            <a class="navbar-brand" href="{{ route('home') }}">
                <i class="fas fa-building"></i> LandingProperties
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="{{ route('home') }}"><i class="fas fa-home"></i> Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#propiedades"><i class="fas fa-building"></i> Propiedades</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#mapa"><i class="fas fa-map-marker-alt"></i> Mapa</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#contacto"><i class="fas fa-envelope"></i> Contacto</a>
                    </li>
                    <li class="nav-item ms-2">
                        <a class="btn btn-outline-light" href="#"><i class="fas fa-user"></i> Iniciar Sesión</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Slider Section -->
    <section class="hero-slider">
        <div class="list">
            <div class="item active">
                <img src="{{ asset('resources/images/casa1.jpg') }}" alt="Casa de lujo">
                <div class="content-header-slider">
                    <p>Exclusivo</p>
                    <h1>Encuentra tu Hogar Ideal</h1>
                    <p>Explora nuestra selección de propiedades exclusivas en las mejores ubicaciones.</p>
                    <div class="hero-buttons">
                        <a href="#propiedades" class="btn btn-light btn-lg"><i class="fas fa-search me-2"></i>Ver propiedades</a>
                        <a href="#contacto" class="btn btn-outline-light btn-lg"><i class="fas fa-envelope me-2"></i>Contactar</a>
                    </div>
                </div>
            </div>
            <div class="item">
                <img src="{{ asset('resources/images/casa2.jpg') }}" alt="Departamento moderno">
                <div class="content-header-slider">
                    <p>Moderno</p>
                    <h1>Propiedades de Lujo</h1>
                    <p>Descubre espacios únicos diseñados para tu estilo de vida.</p>
                    <div class="hero-buttons">
                        <a href="#propiedades" class="btn btn-light btn-lg"><i class="fas fa-search me-2"></i>Ver propiedades</a>
                        <a href="#contacto" class="btn btn-outline-light btn-lg"><i class="fas fa-envelope me-2"></i>Contactar</a>
                    </div>
                </div>
            </div>
            <div class="item">
                <img src="{{ asset('resources/images/casa3.jpg') }}" alt="Casa familiar">
                <div class="content-header-slider">
                    <p>Inversión</p>
                    <h1>Tu Próxima Propiedad te Espera</h1>
                    <p>Encuentra la propiedad perfecta para vivir o invertir.</p>
                    <div class="hero-buttons">
                        <a href="#propiedades" class="btn btn-light btn-lg"><i class="fas fa-search me-2"></i>Ver propiedades</a>
                        <a href="#contacto" class="btn btn-outline-light btn-lg"><i class="fas fa-envelope me-2"></i>Contactar</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="arrows">
            <button id="hero-prev"><i class="fas fa-chevron-left"></i></button>
            <button id="hero-next"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="thumbnail">
            <div class="item active">
                <img src="{{ asset('resources/images/casa1.jpg') }}" alt="Casa de lujo">
            </div>
            <div class="item">
                <img src="{{ asset('resources/images/casa2.jpg') }}" alt="Departamento moderno">
            </div>
            <div class="item">
                <img src="{{ asset('resources/images/casa3.jpg') }}" alt="Casa familiar">
            </div>
        </div>
    </section>

    <!-- Búsqueda Rápida -->
    <section class="quick-search py-5 bg-light">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h4 class="text-center mb-4"><i class="fas fa-search"></i> Búsqueda Rápida</h4>
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fas fa-map-marker-alt"></i></span>
                                        <input type="text" class="form-control" id="quickSearchAddress" placeholder="Ubicación">
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <select class="form-select" id="quickPropertyType">
                                        <option value="">Tipo de Propiedad</option>
                                        <option value="casa">Casa</option>
                                        <option value="departamento">Departamento</option>
                                        <option value="terreno">Terreno</option>
                                        <option value="oficina">Oficina</option>
                                        <option value="local">Local</option>
                                        <option value="bodega">Bodega</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <select class="form-select" id="quickOperationType">
                                        <option value="">Operación</option>
                                        <option value="venta">Venta</option>
                                        <option value="renta">Renta</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <button class="btn btn-primary w-100" id="quickSearchBtn">
                                        <i class="fas fa-search"></i> Buscar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                        <div class="mb-3">
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-search"></i></span>
                                <input type="text" class="form-control" id="searchAddress" placeholder="Buscar por dirección">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label"><i class="fas fa-house"></i> Tipo de Propiedad</label>
                            <select class="form-select" id="propertyType">
                                <option value="">Todos</option>
                                <option value="casa">Casa</option>
                                <option value="departamento">Departamento</option>
                                <option value="terreno">Terreno</option>
                                <option value="oficina">Oficina</option>
                                <option value="local">Local</option>
                                <option value="bodega">Bodega</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label"><i class="fas fa-tag"></i> Operación</label>
                            <select class="form-select" id="operationType">
                                <option value="">Todos</option>
                                <option value="venta">Venta</option>
                                <option value="renta">Renta</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label"><i class="fas fa-dollar-sign"></i> Rango de Precio</label>
                            <div class="input-group mb-2">
                                <span class="input-group-text">Min</span>
                                <input type="number" class="form-control" id="minPrice" placeholder="Mínimo">
                            </div>
                            <div class="input-group">
                                <span class="input-group-text">Max</span>
                                <input type="number" class="form-control" id="maxPrice" placeholder="Máximo">
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label"><i class="fas fa-bed"></i> Habitaciones</label>
                            <select class="form-select" id="habitaciones">
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
                            <select class="form-select" id="banos">
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
                                <div class="col-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="study">
                                        <label class="form-check-label" for="study">Estudio</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="tv_room">
                                        <label class="form-check-label" for="tv_room">Sala TV</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="service_room">
                                        <label class="form-check-label" for="service_room">Cuarto Servicio</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="meeting_room">
                                        <label class="form-check-label" for="meeting_room">Sala Juntas</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="warehouse">
                                        <label class="form-check-label" for="warehouse">Bodega</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="cistern">
                                        <label class="form-check-label" for="cistern">Cisterna</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="pool">
                                        <label class="form-check-label" for="pool">Alberca</label>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="jacuzzi">
                                        <label class="form-check-label" for="jacuzzi">Jacuzzi</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="gym">
                                        <label class="form-check-label" for="gym">Gimnasio</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="event_room">
                                        <label class="form-check-label" for="event_room">Salón Eventos</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="garage">
                                        <label class="form-check-label" for="garage">Garage</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="ramps">
                                        <label class="form-check-label" for="ramps">Rampas</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="grill">
                                        <label class="form-check-label" for="grill">Asador</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="air_conditioning">
                                        <label class="form-check-label" for="air_conditioning">Aire Acondicionado</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="fans">
                                        <label class="form-check-label" for="fans">Ventiladores</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-primary" id="applyFilters">
                                <i class="fas fa-filter me-2"></i> Aplicar Filtros
                            </button>
                            <button type="button" class="btn btn-outline-secondary" id="resetFilters">
                                <i class="fas fa-undo me-2"></i> Limpiar Filtros
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Contenido Principal -->
            <div class="col-lg-9" data-aos="fade-left">
                <div class="row mb-4" id="mapa">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="mb-3"><i class="fas fa-map-marker-alt"></i> Mapa de Propiedades</h4>
                                <div id="map"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-8">
                        <h4><i class="fas fa-building"></i> Propiedades Disponibles</h4>
                    </div>
                    <div class="col-md-4">
                        <div class="d-flex justify-content-end">
                            <select class="form-select" id="sortProperties">
                                <option value="recomendados">Recomendados</option>
                                <option value="precio_asc">Precio: Menor a Mayor</option>
                                <option value="precio_desc">Precio: Mayor a Menor</option>
                                <option value="recientes">Más Recientes</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="row" id="propertiesContainer">
                    <!-- Las tarjetas de propiedades se insertarán aquí dinámicamente -->
                    <div class="col-12 text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                        <p class="mt-2">Cargando propiedades...</p>
                    </div>
                </div>
                
                <!-- Paginación -->
                <nav aria-label="Paginación de propiedades" class="mt-4">
                    <ul class="pagination justify-content-center" id="pagination">
                        <!-- La paginación se generará dinámicamente -->
                    </ul>
                </nav>
            </div>
        </div>
    </div>

    <!-- Estadísticas -->
    <section class="stats-section py-5 bg-primary text-white mt-5">
        <div class="container">
            <div class="row text-center">
                <div class="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="100">
                    <div class="stat-item">
                        <i class="fas fa-home fa-3x mb-3"></i>
                        <h3 class="counter" data-target="500">0</h3>
                        <p>Propiedades</p>
                    </div>
                </div>
                <div class="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="200">
                    <div class="stat-item">
                        <i class="fas fa-users fa-3x mb-3"></i>
                        <h3 class="counter" data-target="1200">0</h3>
                        <p>Clientes Satisfechos</p>
                    </div>
                </div>
                <div class="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="300">
                    <div class="stat-item">
                        <i class="fas fa-map-marker-alt fa-3x mb-3"></i>
                        <h3 class="counter" data-target="25">0</h3>
                        <p>Ciudades</p>
                    </div>
                </div>
                <div class="col-md-3 mb-4" data-aos="fade-up" data-aos-delay="400">
                    <div class="stat-item">
                        <i class="fas fa-award fa-3x mb-3"></i>
                        <h3 class="counter" data-target="15">0</h3>
                        <p>Años de Experiencia</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contacto -->
    <section class="contact-section py-5" id="contacto">
        <div class="container">
            <div class="row mb-5">
                <div class="col-12 text-center" data-aos="fade-up">
                    <h2 class="mb-3">Contáctanos</h2>
                    <p class="text-muted">¿Tienes alguna pregunta? Estamos aquí para ayudarte</p>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <div class="card shadow">
                        <div class="card-body p-5">
                            <form id="contactForm">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="nombre" class="form-label">Nombre</label>
                                        <input type="text" class="form-control" id="nombre" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="email" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="email" required>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="telefono" class="form-label">Teléfono</label>
                                        <input type="tel" class="form-control" id="telefono">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="asunto" class="form-label">Asunto</label>
                                        <select class="form-select" id="asunto" required>
                                            <option value="">Selecciona un asunto</option>
                                            <option value="compra">Compra de propiedad</option>
                                            <option value="venta">Venta de propiedad</option>
                                            <option value="renta">Renta de propiedad</option>
                                            <option value="informacion">Información general</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="mensaje" class="form-label">Mensaje</label>
                                    <textarea class="form-control" id="mensaje" rows="5" required></textarea>
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
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 mb-4">
                    <h5><i class="fas fa-building"></i> LandingProperties</h5>
                    <p>Tu socio de confianza en el mercado inmobiliario. Encontramos la propiedad perfecta para ti.</p>
                    <div class="social-links">
                        <a href="#" class="text-white me-3"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="text-white me-3"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="text-white me-3"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="text-white"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                <div class="col-lg-4 mb-4">
                    <h5>Contacto</h5>
                    <p><i class="fas fa-map-marker-alt me-2"></i> Av. Principal 123, Ciudad, País</p>
                    <p><i class="fas fa-phone me-2"></i> +52 (55) 1234-5678</p>
                    <p><i class="fas fa-envelope me-2"></i> info@landingproperties.com</p>
                    <p><i class="fas fa-clock me-2"></i> Lun - Vie: 9:00 AM - 6:00 PM</p>
                </div>
                <div class="col-lg-4 mb-4">
                    <h5>Enlaces Rápidos</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-white-50">Inicio</a></li>
                        <li><a href="#propiedades" class="text-white-50">Propiedades</a></li>
                        <li><a href="#mapa" class="text-white-50">Mapa</a></li>
                        <li><a href="#contacto" class="text-white-50">Contacto</a></li>
                        <li><a href="#" class="text-white-50">Términos y Condiciones</a></li>
                        <li><a href="#" class="text-white-50">Política de Privacidad</a></li>
                    </ul>
                </div>
            </div>
            <hr class="my-4">
            <div class="row">
                <div class="col-12 text-center">
                    <p>&copy; 2024 LandingProperties. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Modal para detalles de propiedad -->
    <div class="modal fade" id="propertyModal" tabindex="-1" aria-labelledby="propertyModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="propertyModalLabel">Detalles de la Propiedad</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="propertyModalContent">
                    <!-- El contenido se cargará dinámicamente -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary">
                        <i class="fas fa-phone me-2"></i>Contactar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <!-- AOS Animation -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <!-- Waypoints -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/jquery.waypoints.min.js"></script>
    <!-- CounterUp -->
    <script src="{{ asset('resources/js/plugins/jquery.counterup.min.js') }}"></script>
    <!-- Custom Scripts -->
    <script src="{{ asset('resources/js/slider.js') }}"></script>
    <script src="{{ asset('resources/js/main.js') }}"></script>
</body>
</html>