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

$sender_id = $input['sender_id'] ?? null;
$receiver_id = $input['receiver_id'] ?? null;
$message_text = $input['message_text'] ?? null;
$message_type = $input['message_type'] ?? 'text';

if (!$sender_id || !$receiver_id || !$message_text) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields', 'debug' => $input]);
    exit;
}

try {
    $user_low = min($sender_id, $receiver_id);
    $user_high = max($sender_id, $receiver_id);
    
    // First, get or create conversation
    $conv_stmt = $conn->prepare("
        INSERT INTO conversations (user1_id, user2_id, user_low, user_high) 
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
    ");
    $conv_stmt->bind_param("iiii", $sender_id, $receiver_id, $user_low, $user_high);
    $conv_stmt->execute();
    
    // Get conversation ID
    $get_conv = $conn->prepare("SELECT id FROM conversations WHERE user_low = ? AND user_high = ?");
    $get_conv->bind_param("ii", $user_low, $user_high);
    $get_conv->execute();
    $result = $get_conv->get_result();
    $conversation = $result->fetch_assoc();
    $conversation_id = $conversation['id'];
    
    // Insert message
    $stmt = $conn->prepare("INSERT INTO messages (conversation_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiis", $conversation_id, $sender_id, $receiver_id, $message_text);
    
    if ($stmt->execute()) {
        $message_id = $conn->insert_id;
        
        echo json_encode([
            'success' => true, 
            'message_id' => $message_id,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send message']);
    }
} catch (Exception $e) {
    error_log('Send message error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => $e->getMessage(), 'error_details' => $e->getTraceAsString()]);
}
?>