<?php
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../utils.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['name'])) {
    send_json(['success' => false, 'message' => 'School name is required'], 400);
}

$name = $data['name'];
$address = $data['address'] ?? '';
$created_by = $data['created_by'] ?? 1;

$stmt = $conn->prepare("INSERT INTO schools (name, address, created_by) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $name, $address, $created_by);

if ($stmt->execute()) {
    send_json(['success' => true, 'message' => 'School registered successfully']);
} else {
    send_json(['success' => false, 'message' => 'Failed to register school'], 500);
}

$stmt->close();
$conn->close();
?>