// Archivo de configuración principal para integrar todas las mejoras
class LandingPropertiesApp {
    constructor() {
        this.version = '2.0.0';
        this.features = {
            advancedSearch: true,
            propertyComparison: true,
            notifications: true,
            pwa: true,
            darkMode: true,
            analytics: true
        };
        
        this.init();
    }

    async init() {
        console.log(`🏠 LandingProperties v${this.version} iniciando...`);
        
        // Inicializar componentes principales
        await this.initializeCore();
        
        // Inicializar características avanzadas
        await this.initializeFeatures();
        
        // Configurar eventos globales
        this.setupGlobalEvents();
        
        // Inicializar PWA
        if (this.features.pwa) {
            await this.initializePWA();
        }
        
        console.log('✅ LandingProperties inicializado correctamente');
    }

    async initializeCore() {
        // Inicializar mapa
        if (typeof initMap === 'function') {
            initMap();
        }

        // Cargar propiedades
        if (typeof loadProperties === 'function') {
            await loadProperties();
        }

        // Inicializar modal de propiedades
        if (typeof bootstrap !== 'undefined') {
            propertyModal = new bootstrap.Modal(document.getElementById('propertyModal'));
        }

        // Inicializar AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
        }

        // Inicializar contadores
        if (typeof initCounters === 'function') {
            initCounters();
        }
    }

    async initializeFeatures() {
        // Búsqueda avanzada
        if (this.features.advancedSearch && typeof PropertySearch !== 'undefined') {
            window.propertySearch = new PropertySearch();
        }

        // Comparación de propiedades
        if (this.features.propertyComparison && typeof PropertyComparison !== 'undefined') {
            window.propertyComparison = new PropertyComparison();
        }

        // Sistema de notificaciones
        if (this.features.notifications && typeof NotificationSystem !== 'undefined') {
            window.notificationSystem = new NotificationSystem();
        }

        // Modo oscuro
        if (this.features.darkMode) {
            this.initializeDarkMode();
        }

        // Analytics
        if (this.features.analytics) {
            this.initializeAnalytics();
        }
    }

    setupGlobalEvents() {
        // Manejo de errores globales
        window.addEventListener('error', (event) => {
            console.error('Error global:', event.error);
            if (window.notificationSystem) {
                notificationSystem.show('Ha ocurrido un error inesperado', 'error');
            }
        });

        // Manejo de promesas rechazadas
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promesa rechazada:', event.reason);
            event.preventDefault();
        });

        // Detección de conexión
        window.addEventListener('online', () => {
            if (window.notificationSystem) {
                notificationSystem.show('Conexión restaurada', 'success');
            }
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            if (window.notificationSystem) {
                notificationSystem.show('Sin conexión a internet', 'warning');
            }
        });

        // Manejo de visibilidad de página
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.onPageVisible();
            } else {
                this.onPageHidden();
            }
        });
    }

    async initializePWA() {
        // Registrar Service Worker
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registrado:', registration);
                
                // Escuchar actualizaciones
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('Error registrando Service Worker:', error);
            }
        }

        // Mostrar prompt de instalación
        this.setupInstallPrompt();
    }

    setupInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton(deferredPrompt);
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA instalada');
            if (window.notificationSystem) {
                notificationSystem.show('¡Aplicación instalada exitosamente!', 'success');
            }
        });
    }

    showInstallButton(deferredPrompt) {
        const installButton = document.createElement('button');
        installButton.className = 'btn btn-primary install-btn';
        installButton.innerHTML = '<i class="fas fa-download"></i> Instalar App';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
            border-radius: 25px;
            padding: 10px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        installButton.addEventListener('click', async () => {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('Usuario aceptó instalar PWA');
            }
            
            installButton.remove();
            deferredPrompt = null;
        });

        document.body.appendChild(installButton);

        // Auto-ocultar después de 10 segundos
        setTimeout(() => {
            if (installButton.parentNode) {
                installButton.remove();
            }
        }, 10000);
    }

    showUpdateNotification() {
        if (window.notificationSystem) {
            notificationSystem.show(
                'Nueva versión disponible',
                'info',
                0,
                [
                    {
                        text: 'Actualizar',
                        class: 'btn-primary',
                        onclick: 'window.location.reload()'
                    },
                    {
                        text: 'Más tarde',
                        class: 'btn-outline-light',
                        onclick: 'notificationSystem.remove(this.closest(".toast"))'
                    }
                ]
            );
        }
    }

    initializeDarkMode() {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.className = 'btn btn-outline-secondary dark-mode-toggle';
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeToggle.title = 'Alternar modo oscuro';
        
        // Agregar al navbar
        const navbar = document.querySelector('.navbar-nav');
        if (navbar) {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.appendChild(darkModeToggle);
            navbar.appendChild(li);
        }

        // Verificar preferencia guardada
        const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                          window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (isDarkMode) {
            this.enableDarkMode();
        }

        darkModeToggle.addEventListener('click', () => {
            this.toggleDarkMode();
        });
    }

    toggleDarkMode() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
        
        const toggle = document.querySelector('.dark-mode-toggle i');
        if (toggle) {
            toggle.className = 'fas fa-sun';
        }
    }

    disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
        
        const toggle = document.querySelector('.dark-mode-toggle i');
        if (toggle) {
            toggle.className = 'fas fa-moon';
        }
    }

    initializeAnalytics() {
        // Configurar Google Analytics o similar
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: 'LandingProperties',
                page_location: window.location.href
            });
        }

        // Eventos personalizados
        this.trackEvent('app_initialized', {
            version: this.version,
            features: Object.keys(this.features).filter(f => this.features[f])
        });
    }

    trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        
        console.log('📊 Evento:', eventName, parameters);
    }

    onPageVisible() {
        // Actualizar datos si es necesario
        if (Date.now() - this.lastUpdate > 300000) { // 5 minutos
            this.refreshData();
        }
    }

    onPageHidden() {
        // Guardar estado si es necesario
        this.saveState();
    }

    async refreshData() {
        try {
            if (typeof loadProperties === 'function') {
                await loadProperties();
                this.lastUpdate = Date.now();
            }
        } catch (error) {
            console.error('Error actualizando datos:', error);
        }
    }

    saveState() {
        const state = {
            currentPage: currentPage,
            filters: typeof getFilters === 'function' ? getFilters() : {},
            timestamp: Date.now()
        };
        
        localStorage.setItem('appState', JSON.stringify(state));
    }

    async syncOfflineData() {
        // Sincronizar datos offline cuando se restaure la conexión
        try {
            const offlineData = localStorage.getItem('offlineData');
            if (offlineData) {
                const data = JSON.parse(offlineData);
                // Procesar datos offline
                localStorage.removeItem('offlineData');
            }
        } catch (error) {
            console.error('Error sincronizando datos offline:', error);
        }
    }

    // Método para obtener estadísticas de uso
    getUsageStats() {
        return {
            version: this.version,
            features: this.features,
            lastUpdate: this.lastUpdate,
            sessionStart: this.sessionStart || Date.now()
        };
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.landingPropertiesApp = new LandingPropertiesApp();
});

// Exportar para uso global
window.LandingPropertiesApp = LandingPropertiesApp;