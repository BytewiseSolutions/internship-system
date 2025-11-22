<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8100');

try {
    // Check if tables exist
    $tables_check = $conn->query("SHOW TABLES LIKE 'conversations'");
    $conversations_exists = $tables_check->num_rows > 0;
    
    $tables_check = $conn->query("SHOW TABLES LIKE 'messages'");
    $messages_exists = $tables_check->num_rows > 0;
    
    // Try to insert a test conversation
    if ($conversations_exists) {
        $test_conv = $conn->prepare("INSERT INTO conversations (user1_id, user2_id) VALUES (1, 2) ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP");
        $conv_result = $test_conv->execute();
        $conv_id = $conn->insert_id ?: 1;
    }
    
    // Try to insert a test message
    if ($messages_exists && $conversations_exists) {
        $test_msg = $conn->prepare("INSERT INTO messages (conversation_id, sender_id, receiver_id, message) VALUES (?, 1, 2, 'Test message')");
        $test_msg->bind_param("i", $conv_id);
        $msg_result = $test_msg->execute();
        $msg_id = $conn->insert_id;
    }
    
    echo json_encode([
        'conversations_table_exists' => $conversations_exists,
        'messages_table_exists' => $messages_exists,
        'conversation_insert' => $conv_result ?? false,
        'message_insert' => $msg_result ?? false,
        'conversation_id' => $conv_id ?? null,
        'message_id' => $msg_id ?? null,
        'error' => $conn->error
    ]);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>