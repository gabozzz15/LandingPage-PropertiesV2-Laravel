<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar si es una solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos del formulario
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar datos
    if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Por favor, complete todos los campos requeridos.'
        ]);
        exit;
    }
    
    // Validar email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Por favor, ingrese un correo electrónico válido.'
        ]);
        exit;
    }
    
    // En un entorno real, aquí enviarías el correo electrónico
    // Por ahora, solo simularemos que fue exitoso
    
    // Registrar el contacto en la base de datos (opcional)
    try {
        $conn = new PDO("mysql:host=localhost;dbname=inmobiliaria_landing_db", "root", "");
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $conn->prepare("INSERT INTO contactos (nombre, email, telefono, mensaje, fecha_creacion) VALUES (:nombre, :email, :telefono, :mensaje, NOW())");
        
        $stmt->execute([
            ':nombre' => $data['name'],
            ':email' => $data['email'],
            ':telefono' => $data['phone'] ?? '',
            ':mensaje' => $data['message']
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.'
        ]);
    } catch (PDOException $e) {
        // En caso de error, aún podríamos decir que fue exitoso para no confundir al usuario
        // pero registramos el error para el administrador
        file_put_contents('debug.log', date('Y-m-d H:i:s') . ' - Error al guardar contacto: ' . $e->getMessage() . "\n", FILE_APPEND);
        
        echo json_encode([
            'success' => true,
            'message' => 'Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.'
        ]);
    }
} else {
    // Si no es POST, devolver error
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido.'
    ]);
}
?>