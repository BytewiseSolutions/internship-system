<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$id = $_GET['id'] ?? null;
if (!$id)
    send_json(["message" => "User ID required"], 400);

$stmt = $conn->prepare("UPDATE users SET status='ACTIVE' WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    send_json(["message" => "User approved successfully"]);
} else {
    send_json(["message" => "Failed to approve user"], 500);
}
$stmt->close();
$conn->close();
