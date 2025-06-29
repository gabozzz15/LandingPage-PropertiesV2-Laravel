# LandingProperties - Laravel Migration 🏘️

## Descripción del Proyecto

LandingProperties es una aplicación web moderna e interactiva diseñada para mostrar y filtrar propiedades inmobiliarias, ahora migrada a Laravel. La plataforma ofrece una experiencia de usuario intuitiva que permite a los usuarios explorar propiedades mediante un mapa interactivo, filtros avanzados y tarjetas de propiedades detalladas.

## 🌟 Características Principales

- **Mapa Interactivo**: Visualización geográfica de propiedades usando Leaflet
- **Filtros Avanzados**: 
  - Filtrado por tipo de propiedad
  - Filtrado por operación (venta/renta)
  - Rango de precios
  - Filtro por amenidades
- **Tarjetas de Propiedades Detalladas**
- **Responsive Design**: Funciona en dispositivos móviles y de escritorio
- **Búsqueda por Dirección**
- **API RESTful**: Endpoints para obtener propiedades y estadísticas
- **Sistema de Favoritos**: Guardar propiedades favoritas en localStorage

## 🛠️ Tecnologías Utilizadas

### Backend
- **Laravel 10+**: Framework PHP
- **MySQL**: Base de datos
- **Eloquent ORM**: Para manejo de datos

### Frontend
- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Bootstrap 5**
- **Font Awesome**
- **Leaflet.js**: Para mapas interactivos
- **AOS**: Animaciones on scroll

## 📦 Estructura del Proyecto

```
├── app/
│   ├── Http/Controllers/
│   │   └── PropertyController.php
│   └── Models/
│       └── Property.php
├── database/
│   ├── migrations/
│   │   └── 2024_01_01_000000_create_properties_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── PropertySeeder.php
├── resources/
│   ├── css/
│   │   ├── styles.css
│   │   └── slider.css
│   ├── js/
│   │   ├── main.js
│   │   ├── slider.js
│   │   └── plugins/
│   │       └── jquery.counterup.min.js
│   ├── images/
│   │   └── [imágenes de propiedades]
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php
│       ├── partials/
│       │   └── property-card.blade.php
│       └── properties/
│           └── index.blade.php
├── routes/
│   ├── web.php
│   └── api.php
└── config/
    └── database.php
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- PHP 8.1 o superior
- Composer
- MySQL 5.7 o superior
- Node.js y npm (opcional, para compilar assets)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [https://github.com/gabozzz15/LandingPage-PropertiesV2-Laravel]
   cd LandingPage-PropertiesV2-Laravel
   ```

2. **Instalar dependencias de PHP**
   ```bash
   composer install
   ```

3. **Configurar el archivo de entorno**
   ```bash
   cp .env.env
   ```
   
   Editar el archivo `.env` con tu configuración de base de datos:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=inmobiliaria_landing_db
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_contraseña
   ```

4. **Generar la clave de aplicación**
   ```bash
   php artisan key:generate
   ```

5. **Crear la base de datos**
   Crear una base de datos MySQL llamada `inmobiliaria_landing_db`

6. **Ejecutar las migraciones**
   ```bash
   php artisan migrate
   ```

7. **Poblar la base de datos con datos de ejemplo**
   ```bash
   php artisan db:seed
   ```

8. **Crear el enlace simbólico para storage (si usas imágenes)**
   ```bash
   php artisan storage:link
   ```

9. **Iniciar el servidor de desarrollo**
   ```bash
   php artisan serve
   ```

   La aplicación estará disponible en `http://localhost:8000`

## 📊 Base de Datos

### Tabla Properties

La tabla `properties` contiene los siguientes campos:

- **Información básica**: id, title, description, price, currency, address
- **Tipo y operación**: type, operation
- **Características**: bedrooms, bathrooms, built_surface, land_surface
- **Ubicación**: latitude, longitude
- **Imagen**: main_image
- **Amenidades**: study, tv_room, service_room, meeting_room, warehouse, cistern, pool, jacuzzi, gym, event_room, garage, ramps, grill, air_conditioning, fans
- **Timestamps**: created_at, updated_at

## 🔌 API Endpoints

### Propiedades
- `GET /api/properties` - Obtener propiedades con filtros
- `GET /api/properties/{id}` - Obtener una propiedad específica
- `GET /api/stats` - Obtener estadísticas

### Parámetros de filtrado disponibles:
- `type`: Tipo de propiedad (casa, departamento, terreno, etc.)
- `operation`: Operación (venta, renta)
- `price_min`: Precio mínimo
- `price_max`: Precio máximo
- `address`: Búsqueda por dirección
- `bedrooms`: Número mínimo de habitaciones
- `bathrooms`: Número mínimo de baños
- Amenidades: `pool`, `garage`, `gym`, etc.

## 🎨 Personalización

### CSS
Los estilos personalizados se encuentran en:
- `resources/css/styles.css`: Estilos principales
- `resources/css/slider.css`: Estilos del slider

### JavaScript
La funcionalidad JavaScript se encuentra en:
- `resources/js/main.js`: Funcionalidad principal
- `resources/js/slider.js`: Funcionalidad del slider

### Vistas Blade
- `resources/views/layouts/app.blade.php`: Layout principal
- `resources/views/properties/index.blade.php`: Vista principal
- `resources/views/partials/property-card.blade.php`: Componente de tarjeta de propiedad

## 🔧 Desarrollo

### Agregar nuevas propiedades
Puedes agregar propiedades directamente en la base de datos o crear un seeder personalizado.

### Personalizar filtros
Los filtros se pueden personalizar modificando:
1. El formulario en la vista `properties/index.blade.php`
2. La lógica de filtrado en `PropertyController.php`
3. La función `getFilters()` en `main.js`

### Agregar nuevas amenidades
1. Agregar el campo a la migración
2. Actualizar el modelo `Property.php`
3. Modificar el controlador para incluir el nuevo filtro
4. Actualizar las vistas para mostrar la nueva amenidad

## 📱 Responsive Design

La aplicación está completamente optimizada para dispositivos móviles usando Bootstrap 5 y CSS personalizado.

## 🚀 Producción

Para desplegar en producción:

1. Configurar el archivo `.env` para producción
2. Ejecutar `php artisan config:cache`
3. Ejecutar `php artisan route:cache`
4. Ejecutar `php artisan view:cache`
5. Configurar el servidor web (Apache/Nginx)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
