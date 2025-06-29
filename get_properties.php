<?php
// Configuración de encabezados para JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de errores
error_reporting(E_ALL);
ini_set('display_errors', 0);  // Cambiar a 0 para producción

// Función para logging en archivo
function debug_log($data) {
    $logFile = 'debug.log';
    $logData = date('Y-m-d H:i:s') . ' - ';
    
    if (is_array($data) || is_object($data)) {
        $logData .= print_r($data, true);
    } else {
        $logData .= $data;
    }
    
    file_put_contents($logFile, $logData . "\n", FILE_APPEND);
}

// Función para manejar errores y devolver JSON
function sendErrorResponse($message, $query = null, $params = null) {
    $response = [
        'success' => false,
        'error' => $message,
        'debug' => [
            'query' => $query,
            'params' => $params
        ]
    ];
    
    debug_log($message);
    echo json_encode($response);
    exit;
}

try {
    // Conexión a la base de datos con manejo de errores
    $conn = new PDO("mysql:host=localhost;dbname=inmobiliaria_landing_db;charset=utf8", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Construir la consulta base
    $query = "SELECT * FROM propiedades WHERE estado = 'disponible'";
    $params = array();

    debug_log($_GET);

    // Aplicar filtros si existen
    if (!empty($_GET['tipo'])) {
        $query .= " AND tipo = :tipo";
        $params[':tipo'] = $_GET['tipo'];
    }

    if (!empty($_GET['operacion'])) {
        $query .= " AND operacion = :operacion";
        $params[':operacion'] = $_GET['operacion'];
    }

    if (!empty($_GET['precio_min'])) {
        $query .= " AND precio >= :precio_min";
        $params[':precio_min'] = floatval($_GET['precio_min']);
    }

    if (!empty($_GET['precio_max'])) {
        $query .= " AND precio <= :precio_max";
        $params[':precio_max'] = floatval($_GET['precio_max']);
    }
    
    // Filtros para habitaciones y baños
    if (!empty($_GET['habitaciones'])) {
        $query .= " AND habitaciones >= :habitaciones";
        $params[':habitaciones'] = intval($_GET['habitaciones']);
    }
    
    if (!empty($_GET['banos'])) {
        $query .= " AND banos >= :banos";
        $params[':banos'] = intval($_GET['banos']);
    }
    
    // Filtro para superficie
    if (!empty($_GET['superficie_min'])) {
        $query .= " AND superficie_construida >= :superficie_min";
        $params[':superficie_min'] = floatval($_GET['superficie_min']);
    }
    
    if (!empty($_GET['superficie_max'])) {
        $query .= " AND superficie_construida <= :superficie_max";
        $params[':superficie_max'] = floatval($_GET['superficie_max']);
    }

    // Filtros para amenidades
    $amenities = [
        'estudio', 'sala_tv', 'cuarto_servicio', 'sala_juntas', 'bodega',
        'cisterna', 'alberca', 'jacuzzi', 'gimnasio', 'salon_eventos',
        'garage', 'rampas', 'asador', 'aire_acondicionado', 'ventiladores'
    ];

    foreach ($amenities as $amenity) {
        if (isset($_GET[$amenity]) && $_GET[$amenity] === '1') {
            $query .= " AND $amenity = '1'";
        }
    }

    // Búsqueda por dirección
    if (!empty($_GET['direccion'])) {
        $query .= " AND (direccion LIKE :direccion OR titulo LIKE :titulo_direccion OR descripcion LIKE :desc_direccion)";
        $searchTerm = '%' . $_GET['direccion'] . '%';
        $params[':direccion'] = $searchTerm;
        $params[':titulo_direccion'] = $searchTerm;
        $params[':desc_direccion'] = $searchTerm;
    }
    
    // Ordenamiento
    $orderBy = "";
    if (!empty($_GET['orden'])) {
        switch ($_GET['orden']) {
            case 'precio_asc':
                $orderBy = " ORDER BY precio ASC";
                break;
            case 'precio_desc':
                $orderBy = " ORDER BY precio DESC";
                break;
            case 'recientes':
                $orderBy = " ORDER BY fecha_publicacion DESC";
                break;
            default:
                $orderBy = " ORDER BY id_propiedad DESC"; // Por defecto, ordenar por ID descendente
        }
    } else {
        $orderBy = " ORDER BY id_propiedad DESC"; // Por defecto, ordenar por ID descendente
    }
    
    $query .= $orderBy;

    debug_log("Query: " . $query);
    debug_log("Params: " . print_r($params, true));

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Procesar las imágenes adicionales
    foreach ($properties as &$property) {
        if (!empty($property['imagenes_adicionales'])) {
            $property['imagenes_adicionales'] = explode(',', $property['imagenes_adicionales']);
        } else {
            $property['imagenes_adicionales'] = [];
        }
        
        // Asegurarse de que todos los campos numéricos sean números
        $property['precio'] = floatval($property['precio']);
        $property['habitaciones'] = intval($property['habitaciones']);
        $property['banos'] = intval($property['banos']);
        $property['superficie_construida'] = floatval($property['superficie_construida']);
        $property['superficie_terreno'] = floatval($property['superficie_terreno']);
        $property['latitud'] = floatval($property['latitud']);
        $property['longitud'] = floatval($property['longitud']);
        
        // Convertir amenidades a booleanos para JavaScript
        foreach ($amenities as $amenity) {
            $property[$amenity] = $property[$amenity] === '1' ? '1' : '0';
        }
    }

    echo json_encode([
        'success' => true,
        'data' => $properties,
        'count' => count($properties),
        'debug' => [
            'query' => $query,
            'params' => $params,
            'filter_count' => count($params)
        ]
    ]);
} catch(PDOException $e) {
    sendErrorResponse($e->getMessage(), $query ?? null, $params ?? null);
} catch(Exception $e) {
    sendErrorResponse($e->getMessage());
}
?>
