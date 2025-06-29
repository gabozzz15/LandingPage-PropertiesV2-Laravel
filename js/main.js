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

// Crear tarjeta de propiedad con diseño mejorado
function createPropertyCard(property, index) {
    const amenities = [
        { name: 'estudio', icon: 'fa-book', label: 'Estudio' },
        { name: 'sala_tv', icon: 'fa-tv', label: 'Sala TV' },
        { name: 'cuarto_servicio', icon: 'fa-bed', label: 'Cuarto Servicio' },
        { name: 'sala_juntas', icon: 'fa-users', label: 'Sala Juntas' },
        { name: 'bodega', icon: 'fa-box', label: 'Bodega' },
        { name: 'cisterna', icon: 'fa-water', label: 'Cisterna' },
        { name: 'alberca', icon: 'fa-swimming-pool', label: 'Alberca' },
        { name: 'jacuzzi', icon: 'fa-hot-tub', label: 'Jacuzzi' },
        { name: 'gimnasio', icon: 'fa-dumbbell', label: 'Gimnasio' },
        { name: 'salon_eventos', icon: 'fa-glass-cheers', label: 'Salón Eventos' },
        { name: 'garage', icon: 'fa-car', label: 'Garage' },
        { name: 'rampas', icon: 'fa-wheelchair', label: 'Rampas' },
        { name: 'asador', icon: 'fa-fire', label: 'Asador' },
        { name: 'aire_acondicionado', icon: 'fa-snowflake', label: 'Aire Acondicionado' },
        { name: 'ventiladores', icon: 'fa-fan', label: 'Ventiladores' }
    ];

    // Filtrar solo las primeras 3 amenidades para mostrar en la tarjeta
    const activeAmenities = amenities.filter(amenity => property[amenity.name] === '1');
    const displayAmenities = activeAmenities.slice(0, 3);

    const amenitiesHtml = displayAmenities.map(amenity =>
        `<span class="amenity-badge"><i class="fas ${amenity.icon} me-1"></i> ${amenity.label}</span>`
    ).join('');

    // Mostrar indicador de "más amenidades" si hay más de 3
    const moreAmenitiesHtml = activeAmenities.length > 3
        ? `<span class="amenity-badge"><i class="fas fa-plus-circle me-1"></i> ${activeAmenities.length - 3} más</span>`
        : '';

    // Usar la imagen principal de la propiedad o una imagen de placeholder si no existe
    const imageSrc = property.imagen_principal || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(property.tipo)},house`;

    // Verificar si la propiedad está en favoritos
    const isFavorite = favorites.includes(property.id_propiedad);
    const favoriteClass = isFavorite ? 'active' : '';

    // Verificar si la propiedad está en comparación
    const isInComparison = window.propertyComparison && propertyComparison.isInComparison(property.id_propiedad);
    const compareClass = isInComparison ? 'active' : '';

    return `
        <div class="col-md-6 col-lg-4 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="card property-card h-100">
                <div class="position-relative">
                    <img src="${imageSrc}" class="card-img-top" alt="${property.titulo}" loading="lazy">
                    <span class="operation-badge operation-${property.operacion}">${property.operacion.toUpperCase()}</span>
                    <div class="property-actions">
                        <button class="favorite-btn ${favoriteClass}" data-id="${property.id_propiedad}" title="Agregar a favoritos">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="compare-btn ${compareClass}" data-id="${property.id_propiedad}" title="Comparar propiedad" onclick="toggleCompare(${property.id_propiedad})">
                            <i class="fas fa-balance-scale"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${property.titulo}</h5>
                    <p class="price-tag">${formatPrice(property.precio, property.moneda)}</p>
                    <p class="card-text text-muted mb-3"><i class="fas fa-map-marker-alt me-2"></i>${property.direccion}</p>
                    <div class="property-details">
                        ${property.habitaciones > 0 ? `<span class="detail-badge"><i class="fas fa-bed"></i> ${property.habitaciones} Hab</span>` : ''}
                        ${property.banos > 0 ? `<span class="detail-badge"><i class="fas fa-bath"></i> ${property.banos} Baños</span>` : ''}
                        ${property.superficie_construida > 0 ? `<span class="detail-badge"><i class="fas fa-ruler"></i> ${property.superficie_construida}m²</span>` : ''}
                    </div>
                    <div class="amenities-container mt-auto">
                        ${amenitiesHtml}
                        ${moreAmenitiesHtml}
                    </div>
                    <div class="mt-3 d-flex gap-2">
                        <button class="btn btn-primary flex-fill" onclick="showPropertyDetails(${property.id_propiedad})">
                            <i class="fas fa-info-circle me-2"></i>Ver detalles
                        </button>
                        <button class="btn btn-outline-primary" onclick="shareProperty(${property.id_propiedad})" title="Compartir">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Mostrar detalles de la propiedad en un modal
function showPropertyDetails(propertyId) {
    const property = properties.find(p => p.id_propiedad === propertyId);
    if (!property) return;
    
    const amenities = [
        { name: 'estudio', icon: 'fa-book', label: 'Estudio' },
        { name: 'sala_tv', icon: 'fa-tv', label: 'Sala TV' },
        { name: 'cuarto_servicio', icon: 'fa-bed', label: 'Cuarto Servicio' },
        { name: 'sala_juntas', icon: 'fa-users', label: 'Sala Juntas' },
        { name: 'bodega', icon: 'fa-box', label: 'Bodega' },
        { name: 'cisterna', icon: 'fa-water', label: 'Cisterna' },
        { name: 'alberca', icon: 'fa-swimming-pool', label: 'Alberca' },
        { name: 'jacuzzi', icon: 'fa-hot-tub', label: 'Jacuzzi' },
        { name: 'gimnasio', icon: 'fa-dumbbell', label: 'Gimnasio' },
        { name: 'salon_eventos', icon: 'fa-glass-cheers', label: 'Salón Eventos' },
        { name: 'garage', icon: 'fa-car', label: 'Garage' },
        { name: 'rampas', icon: 'fa-wheelchair', label: 'Rampas' },
        { name: 'asador', icon: 'fa-fire', label: 'Asador' },
        { name: 'aire_acondicionado', icon: 'fa-snowflake', label: 'Aire Acondicionado' },
        { name: 'ventiladores', icon: 'fa-fan', label: 'Ventiladores' }
    ];

    const activeAmenities = amenities.filter(amenity => property[amenity.name] === '1');
    
    const amenitiesHtml = activeAmenities.map(amenity => 
        `<div class="col-md-4 mb-2">
            <div class="d-flex align-items-center">
                <i class="fas ${amenity.icon} text-primary me-2"></i>
                <span>${amenity.label}</span>
            </div>
        </div>`
    ).join('');

    // Usar la imagen principal de la propiedad o una imagen de placeholder si no existe
    const imageSrc = property.imagen_principal || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(property.tipo)},house`;

    const modalContent = `
        <div class="row">
            <div class="col-md-6">
                <img src="${imageSrc}" class="img-fluid rounded" alt="${property.titulo}">
            </div>
            <div class="col-md-6">
                <h4>${property.titulo}</h4>
                <p class="price-tag">${formatPrice(property.precio, property.moneda)}</p>
                <p class="text-muted"><i class="fas fa-map-marker-alt me-2"></i>${property.direccion}</p>
                <div class="property-details mb-3">
                    ${property.habitaciones > 0 ? `<span class="detail-badge"><i class="fas fa-bed"></i> ${property.habitaciones} Hab</span>` : ''}
                    ${property.banos > 0 ? `<span class="detail-badge"><i class="fas fa-bath"></i> ${property.banos} Baños</span>` : ''}
                    ${property.superficie_construida > 0 ? `<span class="detail-badge"><i class="fas fa-ruler"></i> ${property.superficie_construida}m²</span>` : ''}
                </div>
                <p>${property.descripcion}</p>
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
    document.getElementById('propertyModalLabel').textContent = property.titulo;
    
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
        const iconClass = property.operacion === 'venta' ? 'fa-tag' : 'fa-key';
        const iconColor = property.operacion === 'venta' ? '#28a745' : '#006aff';
        
        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid ${iconColor};">
                    <i class="fas ${iconClass}" style="color: ${iconColor};"></i>
                   </div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        const marker = L.marker([property.latitud, property.longitud], { icon: customIcon })
            .bindPopup(`
                <div class="property-popup">
                    <div class="popup-image">
                        <img src="${property.imagen_principal || `https://source.unsplash.com/random/400x300/?${encodeURIComponent(property.tipo)},house`}" alt="${property.titulo}">
                    </div>
                    <div class="popup-content">
                        <h5>${property.titulo}</h5>
                        <p class="price-tag">${formatPrice(property.precio, property.moneda)}</p>
                        <p><i class="fas fa-map-marker-alt me-2"></i>${property.direccion}</p>
                        <button class="btn btn-primary btn-sm w-100" onclick="showPropertyDetails(${property.id_propiedad})">
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
        container.innerHTML = currentProperties.map((property, index) => createPropertyCard(property, index)).join('');
        
        // Inicializar los botones de favoritos
        initFavoriteButtons();
    }
    
    // Actualizar paginación
    generatePagination();
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
        toast.remove();
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
    const url = `get_properties.php?${queryParams.toString()}`;
    console.log('URL de la petición:', url);

    // Mostrar indicador de carga
    const container = document.getElementById('propertiesContainer');
    container.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p>Cargando propiedades...</p></div>';

    fetch(url)
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
                
                // Log de debugging
                if (data.debug) {
                    console.log('Query SQL:', data.debug.query);
                    console.log('Parámetros:', data.debug.params);
                    console.log('Número de filtros aplicados:', data.debug.filter_count);
                }

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
            properties.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
            break;
        case 'precio_desc':
            properties.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
            break;
        case 'recientes':
            properties.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));
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
    const tipo = document.getElementById('propertyType').value;
    const operacion = document.getElementById('operationType').value;
    const precioMin = document.getElementById('minPrice').value;
    const precioMax = document.getElementById('maxPrice').value;
    const direccion = document.getElementById('searchAddress').value;
    const habitaciones = document.getElementById('habitaciones')?.value;
    const banos = document.getElementById('banos')?.value;

    if (tipo) filters.tipo = tipo;
    if (operacion) filters.operacion = operacion;
    if (precioMin) filters.precio_min = precioMin;
    if (precioMax) filters.precio_max = precioMax;
    if (direccion) filters.direccion = direccion;
    if (habitaciones) filters.habitaciones = habitaciones;
    if (banos) filters.banos = banos;

    // Amenidades
    const amenities = [
        'estudio', 'sala_tv', 'cuarto_servicio', 'sala_juntas', 'bodega',
        'cisterna', 'alberca', 'jacuzzi', 'gimnasio', 'salon_eventos',
        'garage', 'rampas', 'asador', 'aire_acondicionado', 'ventiladores'
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
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
}

// Inicializar contadores
function initCounters() {
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar mapa
    initMap();
    
    // Inicializar modal de propiedad
    propertyModal = new bootstrap.Modal(document.getElementById('propertyModal'));
    
    // Cargar favoritos desde localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
    
    // Manejar filtros
    document.getElementById('applyFilters').addEventListener('click', function() {
        const filters = getFilters();
        loadProperties(filters);
    });
    
    // Manejar reset de filtros
    document.getElementById('resetFilters')?.addEventListener('click', function() {
        document.getElementById('filterForm').reset();
        loadProperties();
    });

    // Manejar búsqueda rápida
    document.getElementById('quickSearchBtn')?.addEventListener('click', function() {
        const filters = {
            direccion: document.getElementById('quickSearchAddress').value,
            tipo: document.getElementById('quickPropertyType').value,
            operacion: document.getElementById('quickOperationType').value
        };
        
        // Limpiar filtros vacíos
        Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
        });
        
        // Aplicar filtros
        loadProperties(filters);
        
        // Hacer scroll a la sección de propiedades
        document.getElementById('propiedades').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Manejar ordenamiento
    document.getElementById('sortProperties')?.addEventListener('change', function() {
        sortProperties(this.value);
    });
    
    // Manejar formulario de contacto
    document.getElementById('contactForm')?.addEventListener('submit', function(e) {
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
    
    // Inicializar animaciones
    initAOS();
    
    // Inicializar contadores cuando estén visibles
    if (document.querySelector('.counter')) {
        initCounters();
    }

    // Cargar propiedades iniciales
    loadProperties();
});

// Función para alternar comparación de propiedades
function toggleCompare(propertyId) {
    if (window.propertyComparison) {
        const property = properties.find(p => p.id_propiedad == propertyId);
        if (property) {
            if (propertyComparison.isInComparison(propertyId)) {
                propertyComparison.removeFromComparison(propertyId);
                showToast('Propiedad removida de la comparación', 'info');
            } else {
                const added = propertyComparison.addToComparison(property);
                if (added) {
                    showToast('Propiedad agregada a la comparación', 'success');
                } else {
                    showToast('Máximo 3 propiedades para comparar', 'warning');
                }
            }
            // Actualizar la vista
            displayProperties(properties);
        }
    }
}

// Función para compartir propiedad
function shareProperty(propertyId) {
    const property = properties.find(p => p.id_propiedad == propertyId);
    if (!property) return;

    const shareData = {
        title: property.titulo,
        text: `${property.titulo} - ${formatPrice(property.precio, property.moneda)}`,
        url: `${window.location.origin}${window.location.pathname}?property=${propertyId}`
    };

    if (navigator.share) {
        // Usar Web Share API si está disponible
        navigator.share(shareData)
            .then(() => {
                if (window.notificationSystem) {
                    notificationSystem.show('Propiedad compartida exitosamente', 'success');
                }
            })
            .catch((error) => {
                console.log('Error sharing:', error);
                fallbackShare(shareData);
            });
    } else {
        fallbackShare(shareData);
    }
}

// Función de respaldo para compartir
function fallbackShare(shareData) {
    // Copiar URL al portapapeles
    const url = shareData.url;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(url)
            .then(() => {
                if (window.notificationSystem) {
                    notificationSystem.show('Enlace copiado al portapapeles', 'success');
                }
            })
            .catch(() => {
                showShareModal(shareData);
            });
    } else {
        showShareModal(shareData);
    }
}

// Mostrar modal de compartir
function showShareModal(shareData) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Compartir Propiedad</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Comparte esta propiedad:</p>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" value="${shareData.url}" id="share-url" readonly>
                        <button class="btn btn-outline-secondary" onclick="copyToClipboard('share-url')">
                            <i class="fas fa-copy"></i> Copiar
                        </button>
                    </div>
                    <div class="d-flex gap-2">
                        <a href="https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}"
                           target="_blank" class="btn btn-success">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}"
                           target="_blank" class="btn btn-primary">
                            <i class="fab fa-facebook"></i> Facebook
                        </a>
                        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}"
                           target="_blank" class="btn btn-info">
                            <i class="fab fa-twitter"></i> Twitter
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

// Función para copiar al portapapeles
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    element.setSelectionRange(0, 99999);

    try {
        document.execCommand('copy');
        if (window.notificationSystem) {
            notificationSystem.show('Enlace copiado al portapapeles', 'success');
        }
    } catch (err) {
        console.error('Error copying to clipboard:', err);
    }
}

// Función mejorada para obtener filtros
function getFilters() {
    const form = document.getElementById('filterForm');
    if (!form) return {};

    const formData = new FormData(form);
    const filters = {};

    // Obtener valores de inputs de texto
    const textInputs = form.querySelectorAll('input[type="text"], input[type="search"]');
    textInputs.forEach(input => {
        if (input.value.trim()) {
            filters[input.name || input.id] = input.value.trim();
        }
    });

    // Obtener valores de selects
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        if (select.value && select.value !== '') {
            filters[select.name || select.id] = select.value;
        }
    });

    // Obtener checkboxes marcados
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        filters[checkbox.name || checkbox.id] = true;
    });

    // Obtener rangos de precio
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    if (minPrice && minPrice.value) filters.minPrice = minPrice.value;
    if (maxPrice && maxPrice.value) filters.maxPrice = maxPrice.value;

    // Obtener búsqueda avanzada
    const advancedSearch = document.getElementById('advanced-search-input');
    if (advancedSearch && advancedSearch.value.trim()) {
        filters.search = advancedSearch.value.trim();
    }

    return filters;
}

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

// Función para mostrar toast (compatibilidad)
function showToast(message, type = 'info', duration = 5000) {
    if (window.notificationSystem) {
        return notificationSystem.show(message, type, duration);
    } else {
        // Fallback simple
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(message);
    }
}
