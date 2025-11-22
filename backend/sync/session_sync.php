<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$user_id = $input['user_id'] ?? null;
$device_id = $input['device_id'] ?? null;
$session_data = $input['session_data'] ?? null;

if (!$user_id || !$device_id) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    // Update or create session record
    $stmt = $conn->prepare("
        INSERT INTO user_sessions (user_id, device_id, session_data, last_active) 
        VALUES (?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
        session_data = VALUES(session_data), 
        last_active = NOW()
    ");
    $stmt->bind_param("iss", $user_id, $device_id, $session_data);
    
    if ($stmt->execute()) {
        // Get other active sessions for this user
        $other_sessions = $conn->prepare("
            SELECT device_id, session_data, last_active 
            FROM user_sessions 
            WHERE user_id = ? AND device_id != ? 
            AND last_active > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ");
        $other_sessions->bind_param("is", $user_id, $device_id);
        $other_sessions->execute();
        $sessions = $other_sessions->get_result()->fetch_all(MYSQLI_ASSOC);
        
        echo json_encode([
            'success' => true,
            'other_sessions' => $sessions
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to sync session']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>