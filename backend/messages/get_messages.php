<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

$user1_id = $_GET['user1_id'] ?? null;
$user2_id = $_GET['user2_id'] ?? null;
$limit = $_GET['limit'] ?? 50;

if (!$user1_id || !$user2_id) {
    echo json_encode(['success' => false, 'message' => 'Missing user IDs']);
    exit;
}

try {
    // Get conversation first
    $user_low = min($user1_id, $user2_id);
    $user_high = max($user1_id, $user2_id);
    $conv_stmt = $conn->prepare("SELECT id FROM conversations WHERE user_low = ? AND user_high = ?");
    $conv_stmt->bind_param("ii", $user_low, $user_high);
    $conv_stmt->execute();
    $conv_result = $conv_stmt->get_result();
    
    if ($conv_result->num_rows === 0) {
        echo json_encode(['success' => true, 'messages' => []]);
        exit;
    }
    
    $conversation = $conv_result->fetch_assoc();
    $conversation_id = $conversation['id'];
    
    $stmt = $conn->prepare("
        SELECT m.*, 
               u1.name as sender_name
        FROM messages m
        JOIN users u1 ON m.sender_id = u1.user_id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
        LIMIT ?
    ");
    $stmt->bind_param("ii", $conversation_id, $limit);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $messages = [];
    
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
    
    echo json_encode(['success' => true, 'messages' => $messages]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>