<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config.php';
require_once '../../utils.php';

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    send_json(['success' => false, 'message' => 'User ID required'], 400);
}

try {
    $stmt = $conn->prepare("
        SELECT id, message, is_read, created_at 
        FROM notifications 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 20
    ");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $notifications = $result->fetch_all(MYSQLI_ASSOC);
    
    send_json(['success' => true, 'notifications' => $notifications]);
} catch (Exception $e) {
    send_json(['success' => false, 'message' => $e->getMessage()], 500);
}
?>