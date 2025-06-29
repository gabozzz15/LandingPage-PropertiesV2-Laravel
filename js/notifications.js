// Sistema de notificaciones mejorado
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = this.createContainer();
        this.initializeServiceWorker();
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        container.id = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 5000, actions = []) {
        const toast = this.createToast(message, type, duration, actions);
        this.container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }
        
        return toast;
    }

    createToast(message, type, duration, actions) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-header">
                <i class="fas ${this.getIcon(type)} me-2"></i>
                <strong class="me-auto">${this.getTitle(type)}</strong>
                <small class="text-muted">${this.getTimeStamp()}</small>
                <button type="button" class="btn-close" onclick="notificationSystem.remove(this.closest('.toast'))"></button>
            </div>
            <div class="toast-body">
                ${message}
                ${actions.length > 0 ? this.createActions(actions) : ''}
            </div>
            ${duration > 0 ? `<div class="toast-progress"><div class="toast-progress-bar" style="animation-duration: ${duration}ms;"></div></div>` : ''}
        `;
        
        return toast;
    }

    createActions(actions) {
        return `
            <div class="toast-actions mt-2">
                ${actions.map(action => `
                    <button class="btn btn-sm ${action.class || 'btn-outline-light'}" onclick="${action.onclick}">
                        ${action.text}
                    </button>
                `).join('')}
            </div>
        `;
    }

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getTitle(type) {
        const titles = {
            success: 'Éxito',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return titles[type] || titles.info;
    }

    getTimeStamp() {
        return new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    remove(toast) {
        toast.classList.add('hide');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // Notificaciones específicas para inmobiliaria
    newPropertyAlert(property) {
        this.show(
            `Nueva propiedad disponible: ${property.titulo}`,
            'info',
            8000,
            [
                {
                    text: 'Ver Propiedad',
                    class: 'btn-primary',
                    onclick: `showPropertyDetails(${property.id_propiedad})`
                }
            ]
        );
    }

    priceChangeAlert(property, oldPrice, newPrice) {
        const change = newPrice > oldPrice ? 'aumentó' : 'disminuyó';
        const changeClass = newPrice > oldPrice ? 'warning' : 'success';
        
        this.show(
            `El precio de "${property.titulo}" ${change} de ${formatPrice(oldPrice)} a ${formatPrice(newPrice)}`,
            changeClass,
            10000,
            [
                {
                    text: 'Ver Propiedad',
                    class: 'btn-primary',
                    onclick: `showPropertyDetails(${property.id_propiedad})`
                }
            ]
        );
    }

    favoriteAlert(property, added) {
        const message = added 
            ? `"${property.titulo}" agregada a favoritos`
            : `"${property.titulo}" removida de favoritos`;
        
        this.show(message, added ? 'success' : 'info', 3000);
    }

    searchSavedAlert(searchName) {
        this.show(
            `Búsqueda "${searchName}" guardada exitosamente`,
            'success',
            4000,
            [
                {
                    text: 'Ver Búsquedas',
                    class: 'btn-outline-light',
                    onclick: 'propertySearch.displaySavedSearches()'
                }
            ]
        );
    }

    // Service Worker para notificaciones push
    async initializeServiceWorker() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registrado:', registration);
                
                // Solicitar permisos de notificación
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Permisos de notificación concedidos');
                }
            } catch (error) {
                console.error('Error registrando Service Worker:', error);
            }
        }
    }

    // Notificación push para nuevas propiedades
    async sendPushNotification(title, body, data = {}) {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const registration = await navigator.serviceWorker.ready;
            
            if (Notification.permission === 'granted') {
                registration.showNotification(title, {
                    body: body,
                    icon: '/icon-192x192.png',
                    badge: '/badge-72x72.png',
                    data: data,
                    actions: [
                        {
                            action: 'view',
                            title: 'Ver Propiedad'
                        },
                        {
                            action: 'close',
                            title: 'Cerrar'
                        }
                    ]
                });
            }
        }
    }

    // Notificaciones programadas
    scheduleNotification(message, type, delay) {
        setTimeout(() => {
            this.show(message, type);
        }, delay);
    }

    // Limpiar todas las notificaciones
    clearAll() {
        const toasts = this.container.querySelectorAll('.toast');
        toasts.forEach(toast => this.remove(toast));
    }
}

// Inicializar sistema de notificaciones
const notificationSystem = new NotificationSystem();

// Función global para compatibilidad
function showToast(message, type = 'info', duration = 5000) {
    return notificationSystem.show(message, type, duration);
}

// CSS adicional para las notificaciones
const notificationStyles = `
<style>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1060;
    max-width: 400px;
}

.toast {
    margin-bottom: 10px;
    border: none;
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    overflow: hidden;
    position: relative;
}

.toast.show {
    opacity: 1;
    transform: translateX(0);
}

.toast.hide {
    opacity: 0;
    transform: translateX(100%);
}

.toast.success {
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
}

.toast.error {
    background: linear-gradient(135deg, #dc3545, #e74c3c);
    color: white;
}

.toast.warning {
    background: linear-gradient(135deg, #ffc107, #fd7e14);
    color: white;
}

.toast.info {
    background: linear-gradient(135deg, #17a2b8, #6f42c1);
    color: white;
}

.toast-header {
    background: rgba(255,255,255,0.1);
    border-bottom: 1px solid rgba(255,255,255,0.2);
    color: inherit;
}

.toast-body {
    color: inherit;
}

.toast-actions {
    display: flex;
    gap: 8px;
}

.toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255,255,255,0.3);
}

.toast-progress-bar {
    height: 100%;
    background: rgba(255,255,255,0.8);
    animation: toast-progress linear forwards;
}

@keyframes toast-progress {
    from { width: 100%; }
    to { width: 0%; }
}

@media (max-width: 768px) {
    .toast-container {
        left: 20px;
        right: 20px;
        max-width: none;
    }
    
    .toast {
        transform: translateY(-100%);
    }
    
    .toast.show {
        transform: translateY(0);
    }
    
    .toast.hide {
        transform: translateY(-100%);
    }
}
</style>
`;

// Agregar estilos al head
document.head.insertAdjacentHTML('beforeend', notificationStyles);