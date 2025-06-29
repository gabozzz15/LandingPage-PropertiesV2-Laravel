// Sistema de comparación de propiedades
class PropertyComparison {
    constructor() {
        this.compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
        this.maxCompare = 3;
        this.initializeComparison();
    }

    initializeComparison() {
        this.updateCompareButton();
        this.createCompareWidget();
    }

    addToCompare(propertyId) {
        if (this.compareList.includes(propertyId)) {
            this.removeFromCompare(propertyId);
            return;
        }

        if (this.compareList.length >= this.maxCompare) {
            showToast(`Solo puedes comparar hasta ${this.maxCompare} propiedades`, 'warning');
            return;
        }

        this.compareList.push(propertyId);
        localStorage.setItem('compareList', JSON.stringify(this.compareList));
        this.updateCompareButton();
        this.updateCompareWidget();
        showToast('Propiedad agregada a comparación', 'success');
    }

    removeFromCompare(propertyId) {
        this.compareList = this.compareList.filter(id => id !== propertyId);
        localStorage.setItem('compareList', JSON.stringify(this.compareList));
        this.updateCompareButton();
        this.updateCompareWidget();
        showToast('Propiedad removida de comparación', 'info');
    }

    updateCompareButton() {
        const compareButtons = document.querySelectorAll('.compare-btn');
        compareButtons.forEach(btn => {
            const propertyId = parseInt(btn.dataset.id);
            const isInCompare = this.compareList.includes(propertyId);
            
            btn.classList.toggle('active', isInCompare);
            btn.innerHTML = isInCompare 
                ? '<i class="fas fa-check"></i>' 
                : '<i class="fas fa-balance-scale"></i>';
        });
    }

    createCompareWidget() {
        if (document.getElementById('compare-widget')) return;

        const widget = document.createElement('div');
        widget.id = 'compare-widget';
        widget.className = 'compare-widget';
        widget.innerHTML = `
            <div class="compare-header">
                <h6><i class="fas fa-balance-scale"></i> Comparar Propiedades</h6>
                <button class="btn-close" onclick="propertyComparison.toggleWidget()"></button>
            </div>
            <div class="compare-content">
                <div id="compare-items"></div>
                <button class="btn btn-primary w-100 mt-2" onclick="propertyComparison.showComparison()" disabled>
                    Comparar Propiedades
                </button>
            </div>
        `;

        document.body.appendChild(widget);
        this.updateCompareWidget();
    }

    updateCompareWidget() {
        const widget = document.getElementById('compare-widget');
        const itemsContainer = document.getElementById('compare-items');
        const compareBtn = widget.querySelector('.btn-primary');

        if (this.compareList.length === 0) {
            widget.style.display = 'none';
            return;
        }

        widget.style.display = 'block';
        
        // Obtener propiedades para mostrar en el widget
        const compareProperties = properties.filter(p => this.compareList.includes(p.id_propiedad));
        
        itemsContainer.innerHTML = compareProperties.map(property => `
            <div class="compare-item">
                <img src="${property.imagen_principal}" alt="${property.titulo}">
                <div class="compare-item-info">
                    <h6>${property.titulo}</h6>
                    <p>${formatPrice(property.precio, property.moneda)}</p>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="propertyComparison.removeFromCompare(${property.id_propiedad})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        compareBtn.disabled = this.compareList.length < 2;
    }

    toggleWidget() {
        const widget = document.getElementById('compare-widget');
        widget.style.display = widget.style.display === 'none' ? 'block' : 'none';
    }

    async showComparison() {
        if (this.compareList.length < 2) {
            showToast('Necesitas al menos 2 propiedades para comparar', 'warning');
            return;
        }

        const compareProperties = properties.filter(p => this.compareList.includes(p.id_propiedad));
        this.displayComparisonModal(compareProperties);
    }

    displayComparisonModal(compareProperties) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'comparisonModal';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-balance-scale"></i> Comparación de Propiedades</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="comparison-table-container">
                            ${this.generateComparisonTable(compareProperties)}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="propertyComparison.clearComparison()">
                            Limpiar Comparación
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    generateComparisonTable(properties) {
        const features = [
            { key: 'imagen_principal', label: 'Imagen', type: 'image' },
            { key: 'titulo', label: 'Título', type: 'text' },
            { key: 'precio', label: 'Precio', type: 'price' },
            { key: 'tipo', label: 'Tipo', type: 'text' },
            { key: 'operacion', label: 'Operación', type: 'text' },
            { key: 'habitaciones', label: 'Habitaciones', type: 'number' },
            { key: 'banos', label: 'Baños', type: 'number' },
            { key: 'superficie_construida', label: 'Superficie', type: 'area' },
            { key: 'direccion', label: 'Dirección', type: 'text' }
        ];

        const amenities = [
            'estudio', 'sala_tv', 'cuarto_servicio', 'sala_juntas', 'bodega',
            'cisterna', 'alberca', 'jacuzzi', 'gimnasio', 'salon_eventos',
            'garage', 'rampas', 'asador', 'aire_acondicionado', 'ventiladores'
        ];

        return `
            <table class="table table-bordered comparison-table">
                <thead>
                    <tr>
                        <th>Característica</th>
                        ${properties.map(p => `<th class="text-center">${p.titulo}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${features.map(feature => `
                        <tr>
                            <td><strong>${feature.label}</strong></td>
                            ${properties.map(property => `
                                <td class="text-center">
                                    ${this.formatComparisonValue(property[feature.key], feature.type, property)}
                                </td>
                            `).join('')}
                        </tr>
                    `).join('')}
                    <tr>
                        <td colspan="${properties.length + 1}" class="table-secondary">
                            <strong>Amenidades</strong>
                        </td>
                    </tr>
                    ${amenities.map(amenity => `
                        <tr>
                            <td>${amenity.replace('_', ' ').toUpperCase()}</td>
                            ${properties.map(property => `
                                <td class="text-center">
                                    ${property[amenity] === '1' 
                                        ? '<i class="fas fa-check text-success"></i>' 
                                        : '<i class="fas fa-times text-danger"></i>'}
                                </td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    formatComparisonValue(value, type, property) {
        switch (type) {
            case 'image':
                return `<img src="${value}" alt="Propiedad" style="width: 100px; height: 60px; object-fit: cover; border-radius: 5px;">`;
            case 'price':
                return formatPrice(value, property.moneda);
            case 'area':
                return value ? `${value} m²` : 'N/A';
            case 'number':
                return value || 'N/A';
            default:
                return value || 'N/A';
        }
    }

    clearComparison() {
        this.compareList = [];
        localStorage.setItem('compareList', JSON.stringify(this.compareList));
        this.updateCompareButton();
        this.updateCompareWidget();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('comparisonModal'));
        modal.hide();
        
        showToast('Comparación limpiada', 'info');
    }
}

// Inicializar sistema de comparación
const propertyComparison = new PropertyComparison();