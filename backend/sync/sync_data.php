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
$last_sync = $input['last_sync'] ?? '1970-01-01 00:00:00';

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'Missing user ID']);
    exit;
}

try {
    $sync_data = [];
    
    // Get updated applications
    $app_stmt = $conn->prepare("
        SELECT a.*, i.title as internship_title 
        FROM applications a 
        JOIN internships i ON a.internship_id = i.internship_id 
        WHERE a.student_id = (SELECT student_id FROM students WHERE user_id = ?) 
        AND a.applied_at > ?
    ");
    $app_stmt->bind_param("is", $user_id, $last_sync);
    $app_stmt->execute();
    $sync_data['applications'] = $app_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    // Get updated messages
    $msg_stmt = $conn->prepare("
        SELECT m.*, u.name as sender_name 
        FROM messages m 
        JOIN users u ON m.sender_id = u.user_id 
        WHERE (m.sender_id = ? OR m.receiver_id = ?) 
        AND m.created_at > ?
    ");
    $msg_stmt->bind_param("iis", $user_id, $user_id, $last_sync);
    $msg_stmt->execute();
    $sync_data['messages'] = $msg_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    // Get updated notifications
    $notif_stmt = $conn->prepare("
        SELECT * FROM notifications 
        WHERE user_id = ? AND created_at > ?
    ");
    $notif_stmt->bind_param("is", $user_id, $last_sync);
    $notif_stmt->execute();
    $sync_data['notifications'] = $notif_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode([
        'success' => true,
        'sync_data' => $sync_data,
        'sync_timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>