<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');

if (!$email) {
    send_json(['message' => 'Email required'], 400);
}

$stmt = $conn->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    send_json(['message' => 'User not found'], 404);
}

$token = bin2hex(random_bytes(32));
$stmt = $conn->prepare("UPDATE users SET reset_token=? WHERE id=?");
$stmt->bind_param("si", $token, $user['id']);
$stmt->execute();

$resetLink = "http://localhost:4200/reset-password?token=$token";

sendMail($email, "Password Reset Request", "Reset your password here: $resetLink");

send_json(['message' => "Password reset link sent to $email"]);
