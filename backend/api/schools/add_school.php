<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['name'])) {
    send_json(['success' => false, 'message' => 'School name is required'], 400);
}

try {
    $name = $data['name'];
    $address = $data['address'] ?? '';

    $stmt = $conn->prepare("INSERT INTO schools (name, address) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $address);

    if ($stmt->execute()) {
        send_json(['success' => true, 'message' => 'School registered successfully']);
    } else {
        send_json(['success' => false, 'message' => 'Failed to register school: ' . $stmt->error], 500);
    }

    $stmt->close();
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}

$conn->close();
?>