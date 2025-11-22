<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8100');

try {
    // Check conversations table structure
    $conv_desc = $conn->query("DESCRIBE conversations");
    $conv_columns = [];
    while ($row = $conv_desc->fetch_assoc()) {
        $conv_columns[] = $row;
    }
    
    // Check messages table structure
    $msg_desc = $conn->query("DESCRIBE messages");
    $msg_columns = [];
    while ($row = $msg_desc->fetch_assoc()) {
        $msg_columns[] = $row;
    }
    
    echo json_encode([
        'conversations_columns' => $conv_columns,
        'messages_columns' => $msg_columns
    ]);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>