<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');

if (!$email) {
    http_response_code(400);
    echo "Email required.";
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo "User not found.";
    exit;
}

$token = bin2hex(random_bytes(32));
$stmt = $pdo->prepare("UPDATE users SET reset_token=? WHERE id=?");
$stmt->execute([$token, $user['id']]);

$resetLink = "http://localhost:4200/reset-password?token=$token";

sendMail($email, "Password Reset Request", "Reset your password here: $resetLink");

echo "Password reset link sent to $email.";
