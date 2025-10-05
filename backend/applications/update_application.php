<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    send_json(["message" => "Application ID required"], 400);
}

$id = $data['id'];
$status = $data['status'] ?? null;

$updateFields = [];
$params = [];
$types = "";

if ($status !== null) {
    $updateFields[] = "status = ?";
    $params[] = strtoupper($status);
    $types .= "s";
}

if (empty($updateFields)) {
    send_json(["message" => "No fields to update"], 400);
}

$params[] = $id;
$types .= "i";

$sql = "UPDATE applications SET " . implode(", ", $updateFields) . " WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    send_json(["message" => "Application updated successfully"]);
} else {
    send_json(["message" => "Update failed: " . $stmt->error], 500);
}

$stmt->close();
$conn->close();
?>