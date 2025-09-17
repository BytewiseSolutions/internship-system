<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

if (!isset($_GET['id'])) {
    send_json(["message" => "User ID is required"], 400);
}

$id = (int) $_GET['id'];

$stmt = $conn->prepare("UPDATE users SET status='ACTIVE' WHERE id=? AND status='SUSPENDED'");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        send_json(["message" => "User unsuspended successfully."]);
    } else {
        send_json(["message" => "User not found or not suspended."], 404);
    }
} else {
    send_json(["message" => "Error unsuspending user: " . $conn->error], 500);
}

$stmt->close();
$conn->close();
?>