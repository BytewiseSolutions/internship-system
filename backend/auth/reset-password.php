<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$data = json_decode(file_get_contents("php://input"), true);

$token = $data['token'] ?? '';
$newPassword = $data['newPassword'] ?? '';

if (!$token || strlen($newPassword) < 6) {
    http_response_code(400);
    echo "Invalid token or weak password.";
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE reset_token=? LIMIT 1");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(400);
    echo "Invalid or expired token.";
    exit;
}

$hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

$stmt = $pdo->prepare("UPDATE users SET password=?, reset_token=NULL WHERE id=?");
$stmt->execute([$hashedPassword, $user['id']]);

echo "Password reset successfully.";
