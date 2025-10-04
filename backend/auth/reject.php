<?php
require '../cors.php';
require '../config.php';
require '../utils.php';

$id = $_GET['id'] ?? null;
if (!$id)
    send_json(["message" => "User ID required"], 400);

$stmt = $conn->prepare("UPDATE users SET status='REJECTED' WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    send_json(["message" => "User rejected successfully"]);
} else {
    send_json(["message" => "Failed to reject user"], 500);
}
$stmt->close();
$conn->close();
