<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$data = json_decode(file_get_contents("php://input"), true);

$token = $data['token'] ?? '';
$newPassword = $data['newPassword'] ?? '';

if (!$token || strlen($newPassword) < 6) {
    send_json(['message' => 'Invalid token or weak password'], 400);
}

$stmt = $conn->prepare("SELECT id FROM users WHERE reset_token=? LIMIT 1");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    send_json(['message' => 'Invalid or expired token'], 400);
}

$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

$stmt = $conn->prepare("UPDATE users SET password=?, reset_token=NULL WHERE id=?");
$stmt->bind_param("si", $hashedPassword, $user['id']);
$stmt->execute();

send_json(['message' => 'Password reset successfully']);
