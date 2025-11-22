<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$message_id = $input['message_id'] ?? null;
$user_id = $input['user_id'] ?? null;

if (!$message_id || !$user_id) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    // Check if user owns the message
    $check_stmt = $conn->prepare("SELECT sender_id FROM messages WHERE id = ?");
    $check_stmt->bind_param("i", $message_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Message not found']);
        exit;
    }
    
    $message_data = $result->fetch_assoc();
    if ($message_data['sender_id'] != $user_id) {
        echo json_encode(['success' => false, 'message' => 'Not authorized']);
        exit;
    }
    
    // Delete message
    $stmt = $conn->prepare("DELETE FROM messages WHERE id = ?");
    $stmt->bind_param("i", $message_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete message']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>