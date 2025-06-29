// Mejoras al sistema de búsqueda
class PropertySearch {
    constructor() {
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        this.savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
        this.initializeSearch();
    }

    initializeSearch() {
        this.setupAutoComplete();
        this.setupSearchHistory();
        this.setupSavedSearches();
    }

    // Autocompletado inteligente
    setupAutoComplete() {
        const searchInput = document.getElementById('searchAddress');
        if (!searchInput) return;

        let timeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.showSuggestions(e.target.value);
            }, 300);
        });
    }

    async showSuggestions(query) {
        if (query.length < 2) return;

        try {
            // Simular API de geocodificación
            const suggestions = await this.getLocationSuggestions(query);
            this.displaySuggestions(suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    async getLocationSuggestions(query) {
        // En producción, usar una API real como Mapbox o Google Places
        const mockSuggestions = [
            'Caracas, Venezuela',
            'Valencia, Venezuela',
            'Maracaibo, Venezuela',
            'Barquisimeto, Venezuela'
        ].filter(city => city.toLowerCase().includes(query.toLowerCase()));

        return mockSuggestions;
    }

    displaySuggestions(suggestions) {
        const container = document.getElementById('suggestions-container') || this.createSuggestionsContainer();
        
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = suggestions.map(suggestion => 
            `<div class="suggestion-item" onclick="propertySearch.selectSuggestion('${suggestion}')">${suggestion}</div>`
        ).join('');
        
        container.style.display = 'block';
    }

    createSuggestionsContainer() {
        const container = document.createElement('div');
        container.id = 'suggestions-container';
        container.className = 'suggestions-container';
        
        const searchInput = document.getElementById('searchAddress');
        searchInput.parentNode.appendChild(container);
        
        return container;
    }

    selectSuggestion(suggestion) {
        document.getElementById('searchAddress').value = suggestion;
        document.getElementById('suggestions-container').style.display = 'none';
        this.addToSearchHistory(suggestion);
        loadProperties(); // Recargar propiedades con el nuevo filtro
    }

    // Historial de búsquedas
    addToSearchHistory(query) {
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            this.searchHistory = this.searchHistory.slice(0, 10); // Mantener solo 10
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        }
    }

    setupSearchHistory() {
        const historyContainer = document.getElementById('search-history');
        if (!historyContainer || this.searchHistory.length === 0) return;

        historyContainer.innerHTML = `
            <h6><i class="fas fa-history"></i> Búsquedas recientes</h6>
            ${this.searchHistory.map(search => 
                `<div class="history-item" onclick="propertySearch.selectSuggestion('${search}')">${search}</div>`
            ).join('')}
        `;
    }

    // Búsquedas guardadas
    saveCurrentSearch() {
        const filters = getFilters();
        const searchName = prompt('Nombre para esta búsqueda:');
        
        if (searchName) {
            const savedSearch = {
                id: Date.now(),
                name: searchName,
                filters: filters,
                date: new Date().toISOString()
            };
            
            this.savedSearches.push(savedSearch);
            localStorage.setItem('savedSearches', JSON.stringify(this.savedSearches));
            this.displaySavedSearches();
            showToast('Búsqueda guardada exitosamente', 'success');
        }
    }

    displaySavedSearches() {
        const container = document.getElementById('saved-searches');
        if (!container) return;

        container.innerHTML = `
            <h6><i class="fas fa-bookmark"></i> Búsquedas guardadas</h6>
            ${this.savedSearches.map(search => `
                <div class="saved-search-item">
                    <span onclick="propertySearch.loadSavedSearch(${search.id})">${search.name}</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="propertySearch.deleteSavedSearch(${search.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('')}
        `;
    }

    loadSavedSearch(id) {
        const search = this.savedSearches.find(s => s.id === id);
        if (search) {
            this.applyFilters(search.filters);
            loadProperties();
        }
    }

    deleteSavedSearch(id) {
        this.savedSearches = this.savedSearches.filter(s => s.id !== id);
        localStorage.setItem('savedSearches', JSON.stringify(this.savedSearches));
        this.displaySavedSearches();
    }

    applyFilters(filters) {
        Object.keys(filters).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = filters[key];
                } else {
                    element.value = filters[key];
                }
            }
        });
    }
}

// Inicializar búsqueda avanzada
const propertySearch = new PropertySearch();