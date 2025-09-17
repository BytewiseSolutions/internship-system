<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$id = $_GET['id'] ?? null;
if (!$id) {
    send_json(["message" => "Company ID required"], 400);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['status'])) {
    send_json(["message" => "Missing required fields"], 400);
}

$status = $data['status'];

$stmt = $conn->prepare("UPDATE companies SET status=? WHERE id=?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    send_json([
        "id" => (int) $id,
        "status" => $status,
        "message" => "Company status updated successfully"
    ]);
} else {
    send_json(["message" => "Failed to update status"], 500);
}
