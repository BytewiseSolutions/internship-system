<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$id = $_GET['id'] ?? null;

if (!$id || !is_numeric($id)) {
    send_json(["message" => "Valid Company ID required"], 400);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['confirm']) || $data['confirm'] !== true) {
    send_json([
        "message" => "Please confirm before deleting",
        "hint" => "Send {\"confirm\": true} in the request body"
    ], 400);
}

$stmt = $conn->prepare("SELECT id FROM companies WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    send_json(["message" => "Company not found"], 404);
}
$stmt->close();

$stmt = $conn->prepare("DELETE FROM companies WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    send_json(["message" => "Company deleted successfully", "id" => (int) $id]);
} else {
    send_json(["message" => "Failed to delete company"], 500);
}

$stmt->close();
$conn->close();
