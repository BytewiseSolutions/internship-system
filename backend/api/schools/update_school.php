<?php
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../utils.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['school_id'], $data['name'])) {
    send_json(['success' => false, 'message' => 'School ID and name are required'], 400);
}

$school_id = $data['school_id'];
$name = $data['name'];
$address = $data['address'] ?? '';

$stmt = $conn->prepare("UPDATE schools SET name = ?, address = ? WHERE school_id = ?");
$stmt->bind_param("ssi", $name, $address, $school_id);

if ($stmt->execute()) {
    send_json(['success' => true, 'message' => 'School updated successfully']);
} else {
    send_json(['success' => false, 'message' => 'Failed to update school'], 500);
}

$stmt->close();
$conn->close();
?>