<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $_GET['id'] ?? null;

if (!$id) {
    send_json(["message" => "User ID required"], 400);
}

$stmt = $conn->prepare("UPDATE users SET status='SUSPENDED' WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    send_json(["message" => "User suspended"]);
} else {
    send_json(["message" => "Failed to suspend user"], 500);
}
$stmt->close();
$conn->close();
