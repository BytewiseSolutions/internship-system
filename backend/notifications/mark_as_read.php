<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';
require_once '../utils.php';

$input = json_decode(file_get_contents('php://input'), true);
$notification_id = $input['notification_id'] ?? null;

if (!$notification_id) {
    send_json(['success' => false, 'message' => 'Notification ID is required'], 400);
}

try {
    $stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
    $stmt->bind_param('i', $notification_id);
    
    if ($stmt->execute()) {
        send_json(['success' => true, 'message' => 'Notification marked as read']);
    } else {
        send_json(['success' => false, 'message' => 'Failed to update notification'], 500);
    }
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>