<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

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

$stmt = $conn->prepare("INSERT INTO users (name, email, contact, password, role, status) VALUES (?, ?, ?, ?, 'COMPANY', 'PENDING')");
if (!$stmt) {
    send_json(["message" => "Failed to prepare query: " . $conn->error], 500);
    exit;
}

$stmt->bind_param("ssss", $name, $email, $contact, $hashedPassword);

if (!$stmt->execute()) {
    send_json(["message" => "User registration failed: " . $stmt->error], 500);
    exit;
}

$userId = $stmt->insert_id;
$stmt->close();

send_json(["message" => "User account created. Proceed to company details.", "user_id" => $userId]);
