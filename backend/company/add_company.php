<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['name'], $data['email'])) {
    send_json(['success' => false, 'message' => 'Missing required fields'], 400);
}

$name = $data['name'];
$email = $data['email'];
$address = $data['address'] ?? '';
$created_by = $data['created_by'] ?? 1;

$stmt = $conn->prepare("INSERT INTO companies (name, email, address, created_by) VALUES (?, ?, ?, ?)");
$stmt->bind_param("sssi", $name, $email, $address, $created_by);

if ($stmt->execute()) {
    send_json(['success' => true, 'message' => 'Company registered successfully']);
} else {
    send_json(['success' => false, 'message' => 'Failed to register company'], 500);
}

$stmt->close();
$conn->close();
?>