<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8100');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'Missing user ID']);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT c.*,
               CASE 
                   WHEN c.user1_id = ? THEN u2.name
                   ELSE u1.name
               END as other_user_name,
               CASE 
                   WHEN c.user1_id = ? THEN c.user2_id
                   ELSE c.user1_id
               END as other_user_id,
               (SELECT m.message FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
               (SELECT m.created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message_time
        FROM conversations c
        LEFT JOIN users u1 ON c.user1_id = u1.user_id
        LEFT JOIN users u2 ON c.user2_id = u2.user_id
        WHERE c.user1_id = ? OR c.user2_id = ?
        ORDER BY c.updated_at DESC
    ");
    $stmt->bind_param("iiii", $user_id, $user_id, $user_id, $user_id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $conversations = [];
    
    while ($row = $result->fetch_assoc()) {
        $conversations[] = $row;
    }
    
    echo json_encode(['success' => true, 'conversations' => $conversations]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>