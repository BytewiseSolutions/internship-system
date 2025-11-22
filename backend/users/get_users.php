<?php
require_once '../config.php';
require_once '../security_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT user_id as id, name, email, role 
        FROM users 
        WHERE status = 'ACTIVE' 
        ORDER BY name ASC
    ");
    
    $result = $stmt->execute();
    if ($result) {
        $users = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        echo json_encode([
            'success' => true,
            'users' => $users
        ]);
    } else {
        throw new Exception('Query execution failed');
    }
    
} catch (Exception $e) {
    error_log("Get users error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load users'
    ]);
}
?>