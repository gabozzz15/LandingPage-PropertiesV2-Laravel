let map;
let markers = [];
let properties = [];
let currentPage = 1;
let propertiesPerPage = 6;
let totalPages = 0;
let propertyModal;
let favorites = [];

// Inicializar el mapa con estilo mejorado
function initMap() {
    map = L.map('map').setView([10.4806, -66.9036], 7); // Centro de Venezuela (Caracas)
    
    // Usar un estilo de mapa más moderno
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
}

// Función para formatear precio
function formatPrice(price, currency) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currency || 'MXN',
        maximumFractionDigits: 0
    }).format(price);
}

// Mostrar detalles de la propiedad en un modal
function showPropertyDetails(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    const amenities = [
        { name: 'study', icon: 'fa-book', label: 'Estudio' },
        { name: 'tv_room', icon: 'fa-tv', label: 'Sala TV' },
        { name: 'service_room', icon: 'fa-bed', label: 'Cuarto Servicio' },
        { name: 'meeting_room', icon: 'fa-users', label: 'Sala Juntas' },
        { name: 'warehouse', icon: 'fa-box', label: 'Bodega' },
        { name: 'cistern', icon: 'fa-water', label: 'Cisterna' },
        { name: 'pool', icon: 'fa-swimming-pool', label: 'Alberca' },
        { name: 'jacuzzi', icon: 'fa-hot-tub', label: 'Jacuzzi' },
        { name: 'gym', icon: 'fa-dumbbell', label: 'Gimnasio' },
        { name: 'event_room', icon: 'fa-glass-cheers', label: 'Salón Eventos' },
        { name: 'garage', icon: 'fa-car', label: 'Garage' },
        { name: 'ramps', icon: 'fa-wheelchair', label: 'Rampas' },
        { name: 'grill', icon: 'fa-fire', label: 'Asador' },
        { name: 'air_conditioning', icon: 'fa-snowflake', label: 'Aire Acondicionado' },
        { name: 'fans', icon: 'fa-fan', label: 'Ventiladores' }
    ];

    const activeAmenities = amenities.filter(amenity => property[amenity.name]);
    
    const amenitiesHtml = activeAmenities.map(amenity => 
        `<div class="col-md-4 mb-2">
            <div class="d-flex align-items-center">
                <i class="fas ${amenity.icon} text-primary me-2"></i>
                <span>${amenity.label}</span>
            </div>
        </div>`
    ).join('');

    // Usar la imagen principal de la propiedad o una imagen de placeholder si no existe
    const imageSrc = property.main_image || `https://source.unsplash.com/800x600/?${encodeURIComponent(property.type)},house`;

    const modalContent = `
        <div class="row">
            <div class="col-md-6">
                <img src="${imageSrc}" class="img-fluid rounded" alt="${property.title}">
            </div>
            <div class="col-md-6">
                <h4>${property.title}</h4>
                <p class="price-tag">${property.formatted_price}</p>
                <p class="text-muted"><i class="fas fa-map-marker-alt me-2"></i>${property.address}</p>
                <div class="property-details mb-3">
                    ${property.bedrooms > 0 ? `<span class="detail-badge"><i class="fas fa-bed"></i> ${property.bedrooms} Hab</span>` : ''}
                    ${property.bathrooms > 0 ? `<span class="detail-badge"><i class="fas fa-bath"></i> ${property.bathrooms} Baños</span>` : ''}
                    ${property.built_surface > 0 ? `<span class="detail-badge"><i class="fas fa-ruler"></i> ${property.built_surface}m²</span>` : ''}
                </div>
                <p>${property.description}</p>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-12">
                <h5 class="mb-3">Amenidades</h5>
                <div class="row">
                    ${amenitiesHtml}
                </div>
            </div>
        </div>
    `;

    document.getElementById('propertyModalContent').innerHTML = modalContent;
    document.getElementById('propertyModalLabel').textContent = property.title;
    
    // Mostrar el modal
    propertyModal.show();
}

// Actualizar marcadores en el mapa con estilo mejorado
function updateMapMarkers(properties) {
    // Limpiar marcadores existentes
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Añadir nuevos marcadores con estilo personalizado
    properties.forEach(property => {
        // Crear icono personalizado según el tipo de propiedad
        const iconClass = property.operation === 'venta' ? 'fa-tag' : 'fa-key';
        const iconColor = property.operation === 'venta' ? '#28a745' : '#006aff';
        
        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid ${iconColor};">
                    <i class="fas ${iconClass}" style="color: ${iconColor};"></i>
                   </div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        const marker = L.marker([property.latitude, property.longitude], { icon: customIcon })
            .bindPopup(`
                <div class="property-popup">
                    <div class="popup-image">
                        <img src="${property.main_image || `https://source.unsplash.com/400x300/?${encodeURIComponent(property.type)},house`}" alt="${property.title}">
                    </div>
                    <div class="popup-content">
                        <h5>${property.title}</h5>
                        <p class="price-tag">${property.formatted_price}</p>
                        <p><i class="fas fa-map-marker-alt me-2"></i>${property.address}</p>
                        <button class="btn btn-primary btn-sm w-100" onclick="showPropertyDetails(${property.id})">
                            <i class="fas fa-info-circle me-2"></i>Ver detalles
                        </button>
                    </div>
                </div>
            `, {
                className: 'custom-popup',
                maxWidth: 300
            });
        
        markers.push(marker);
        marker.addTo(map);
    });

    // Ajustar vista si hay marcadores
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
}

// Generar paginación
function generatePagination() {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement) return;
    
    totalPages = Math.ceil(properties.length / propertiesPerPage);
    
    let paginationHTML = '';
    
    // Botón anterior
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Anterior">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;
    
    // Páginas
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    
    // Botón siguiente
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Siguiente">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;
    
    paginationElement.innerHTML = paginationHTML;
    
    // Añadir event listeners a los enlaces de paginación
    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.dataset.page);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                displayProperties();
            }
        });
    });
}

// Mostrar propiedades con paginación
function displayProperties() {
    const container = document.getElementById('propertiesContainer');
    
    // Calcular índices para la paginación
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = Math.min(startIndex + propertiesPerPage, properties.length);
    
    // Obtener propiedades para la página actual
    const currentProperties = properties.slice(startIndex, endIndex);
    
    if (currentProperties.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">No se encontraron propiedades con los filtros seleccionados.</div></div>';
    } else {
        // Renderizar las propiedades usando el partial de Laravel
        container.innerHTML = '';
        currentProperties.forEach((property, index) => {
            // Crear un elemento temporal para renderizar el partial
            const propertyElement = document.createElement('div');
            propertyElement.innerHTML = renderPropertyCard(property, index);
            container.appendChild(propertyElement.firstElementChild);
        });
        
        // Inicializar los botones de favoritos
        initFavoriteButtons();
    }
    
    // Actualizar paginación
    generatePagination();
}

// Función para renderizar tarjeta de propiedad (simulando el partial de Laravel)
function renderPropertyCard(property, index) {
    const amenities = {
        study: { icon: 'fa-book', name: 'Estudio' },
        tv_room: { icon: 'fa-tv', name: 'Sala TV' },
        service_room: { icon: 'fa-bed', name: 'Cuarto Servicio' },
        meeting_room: { icon: 'fa-users', name: 'Sala Juntas' },
        warehouse: { icon: 'fa-box', name: 'Bodega' },
        cistern: { icon: 'fa-water', name: 'Cisterna' },
        pool: { icon: 'fa-swimming-pool', name: 'Alberca' },
        jacuzzi: { icon: 'fa-hot-tub', name: 'Jacuzzi' },
        gym: { icon: 'fa-dumbbell', name: 'Gimnasio' },
        event_room: { icon: 'fa-glass-cheers', name: 'Salón Eventos' },
        garage: { icon: 'fa-car', name: 'Garage' },
        ramps: { icon: 'fa-wheelchair', name: 'Rampas' },
        grill: { icon: 'fa-fire', name: 'Asador' },
        air_conditioning: { icon: 'fa-snowflake', name: 'Aire Acondicionado' },
        fans: { icon: 'fa-fan', name: 'Ventiladores' }
    };

    const activeAmenities = Object.keys(amenities).filter(key => property[key]);
    const displayAmenities = activeAmenities.slice(0, 3);
    
    const amenitiesHtml = displayAmenities.map(key => 
        `<span class="amenity-badge">
            <i class="fas ${amenities[key].icon} me-1"></i> ${amenities[key].name}
        </span>`
    ).join('');

    const moreAmenitiesHtml = activeAmenities.length > 3 
        ? `<span class="amenity-badge">
            <i class="fas fa-plus-circle me-1"></i> ${activeAmenities.length - 3} más
        </span>` 
        : '';

    const imageSrc = property.main_image || `https://source.unsplash.com/800x600/?${encodeURIComponent(property.type)},house`;
    const isFavorite = favorites.includes(property.id);
    const favoriteClass = isFavorite ? 'active' : '';

    return `
        <div class="col-md-6 col-lg-4 mb-4" data-aos="fade-up">
            <div class="card property-card h-100">
                <div class="position-relative">
                    <img src="${imageSrc}" class="card-img-top" alt="${property.title}">
                    <span class="operation-badge operation-${property.operation}">${property.operation.toUpperCase()}</span>
                    <button class="favorite-btn ${favoriteClass}" data-id="${property.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${property.title}</h5>
                    <p class="price-tag">${property.formatted_price}</p>
                    <p class="card-text text-muted mb-3">
                        <i class="fas fa-map-marker-alt me-2"></i>${property.address}
                    </p>
                    <div class="property-details">
                        ${property.bedrooms > 0 ? `<span class="detail-badge"><i class="fas fa-bed"></i> ${property.bedrooms} Hab</span>` : ''}
                        ${property.bathrooms > 0 ? `<span class="detail-badge"><i class="fas fa-bath"></i> ${property.bathrooms} Baños</span>` : ''}
                        ${property.built_surface > 0 ? `<span class="detail-badge"><i class="fas fa-ruler"></i> ${property.built_surface}m²</span>` : ''}
                    </div>
                    <div class="amenities-container mt-auto">
                        ${amenitiesHtml}
                        ${moreAmenitiesHtml}
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-primary w-100" onclick="showPropertyDetails(${property.id})">
                            <i class="fas fa-info-circle me-2"></i>Ver detalles
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Inicializar botones de favoritos
function initFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const propertyId = parseInt(this.dataset.id);
            toggleFavorite(propertyId, this);
        });
    });
}

// Alternar favorito
function toggleFavorite(propertyId, button) {
    const index = favorites.indexOf(propertyId);
    
    if (index === -1) {
        // Añadir a favoritos
        favorites.push(propertyId);
        button.classList.add('active');
        showToast('Propiedad añadida a favoritos', 'success');
    } else {
        // Quitar de favoritos
        favorites.splice(index, 1);
        button.classList.remove('active');
        showToast('Propiedad eliminada de favoritos', 'info');
    }
    
    // Guardar favoritos en localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Mostrar toast de notificación
function showToast(message, type = 'info') {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        min-width: 300px;
    `;
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">${type === 'success' ? 'Éxito' : 'Información'}</strong>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Añadir al body
    document.body.appendChild(toast);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// Cargar y mostrar propiedades
function loadProperties(filters = {}) {
    // Eliminar filtros vacíos
    Object.keys(filters).forEach(key => {
        if (filters[key] === '' || filters[key] === null || filters[key] === undefined) {
            delete filters[key];
        }
    });

    console.log('Aplicando filtros:', filters);
    const queryParams = new URLSearchParams(filters);
    const url = `/api/properties?${queryParams.toString()}`;
    console.log('URL de la petición:', url);

    // Mostrar indicador de carga
    const container = document.getElementById('propertiesContainer');
    container.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p>Cargando propiedades...</p></div>';

    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta completa:', data);

            if (data.success) {
                properties = data.data;
                
                // Resetear a la primera página
                currentPage = 1;
                
                // Mostrar resultados
                if (properties.length === 0) {
                    container.innerHTML = '<div class="col-12"><div class="alert alert-info">No se encontraron propiedades con los filtros seleccionados.</div></div>';
                } else {
                    // Mostrar propiedades con paginación
                    displayProperties();
                    updateMapMarkers(properties);
                }
            } else {
                console.error('Error en la respuesta:', data.error);
                container.innerHTML = `<div class="col-12"><div class="alert alert-danger">Error al cargar las propiedades: ${data.error}</div></div>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = `<div class="col-12"><div class="alert alert-danger">Error al cargar las propiedades: ${error.message}</div></div>`;
        });
}

// Ordenar propiedades
function sortProperties(sortBy) {
    switch(sortBy) {
        case 'precio_asc':
            properties.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'precio_desc':
            properties.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'recientes':
            properties.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'recomendados':
        default:
            // Por defecto, no hacemos nada, mantenemos el orden original
            break;
    }
    
    // Resetear a la primera página y mostrar propiedades
    currentPage = 1;
    displayProperties();
}

// Recolectar filtros del formulario
function getFilters() {
    const filters = {};
    
    // Filtros básicos
    const tipo = document.getElementById('propertyType')?.value;
    const operacion = document.getElementById('operationType')?.value;
    const precioMin = document.getElementById('minPrice')?.value;
    const precioMax = document.getElementById('maxPrice')?.value;
    const direccion = document.getElementById('searchAddress')?.value;
    const habitaciones = document.getElementById('habitaciones')?.value;
    const banos = document.getElementById('banos')?.value;

    if (tipo) filters.type = tipo;
    if (operacion) filters.operation = operacion;
    if (precioMin) filters.price_min = precioMin;
    if (precioMax) filters.price_max = precioMax;
    if (direccion) filters.address = direccion;
    if (habitaciones) filters.bedrooms = habitaciones;
    if (banos) filters.bathrooms = banos;

    // Amenidades
    const amenities = [
        'study', 'tv_room', 'service_room', 'meeting_room', 'warehouse',
        'cistern', 'pool', 'jacuzzi', 'gym', 'event_room',
        'garage', 'ramps', 'grill', 'air_conditioning', 'fans'
    ];

    amenities.forEach(amenity => {
        const checkbox = document.getElementById(amenity);
        if (checkbox && checkbox.checked) {
            filters[amenity] = '1';
        }
    });

    return filters;
}

// Inicializar animaciones AOS
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
}

// Inicializar contadores
function initCounters() {
    if (typeof $ !== 'undefined' && $.fn.counterUp) {
        $('.counter').counterUp({
            delay: 10,
            time: 1000
        });
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar mapa
    if (document.getElementById('map')) {
        initMap();
    }
    
    // Inicializar modal de propiedad
    const propertyModalElement = document.getElementById('propertyModal');
    if (propertyModalElement && typeof bootstrap !== 'undefined') {
        propertyModal = new bootstrap.Modal(propertyModalElement);
    }
    
    // Cargar favoritos desde localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
    
    // Manejar filtros
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const filters = getFilters();
            loadProperties(filters);
        });
    }
    
    // Manejar reset de filtros
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            const filterForm = document.getElementById('filterForm');
            if (filterForm) {
                filterForm.reset();
                loadProperties();
            }
        });
    }

    // Manejar búsqueda rápida
    const quickSearchBtn = document.getElementById('quickSearchBtn');
    if (quickSearchBtn) {
        quickSearchBtn.addEventListener('click', function() {
            const filters = {
                address: document.getElementById('quickSearchAddress')?.value,
                type: document.getElementById('quickPropertyType')?.value,
                operation: document.getElementById('quickOperationType')?.value
            };
            
            // Limpiar filtros vacíos
            Object.keys(filters).forEach(key => {
                if (!filters[key]) delete filters[key];
            });
            
            // Aplicar filtros
            loadProperties(filters);
            
            // Hacer scroll a la sección de propiedades
            const propiedadesSection = document.getElementById('propiedades');
            if (propiedadesSection) {
                propiedadesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Manejar ordenamiento
    const sortPropertiesSelect = document.getElementById('sortProperties');
    if (sortPropertiesSelect) {
        sortPropertiesSelect.addEventListener('change', function() {
            sortProperties(this.value);
        });
    }
    
    // Manejar formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulación de envío de formulario
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
            
            // Simular envío (en un caso real, aquí iría el fetch a un endpoint)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Mostrar mensaje de éxito
                showToast('Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.', 'success');
                
                // Limpiar formulario
                this.reset();
            }, 1500);
        });
    }
    
    // Inicializar animaciones
    initAOS();
    
    // Inicializar contadores cuando estén visibles
    if (document.querySelector('.counter')) {
        initCounters();
    }

    // Cargar propiedades iniciales
    loadProperties();
});

// Smooth scroll para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});