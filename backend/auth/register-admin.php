<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$contact = trim($data['contact'] ?? '');
$password = $data['password'] ?? '';

if (!$name || !$email || !$password) {
    send_json(["message" => "All fields are required."], 400);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users (name, email, contact, password, role, status) VALUES (?, ?, ?, ?, 'ADMIN', 'PENDING')");

if ($stmt->execute([$name, $email, $contact, $hashedPassword])) {
    send_json(["message" => "Admin registration submitted for approval."]);
} else {
    send_json(["message" => "Registration failed: " . $conn->error], 500);
}
?>