<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Extract and trim fields
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$contact = trim($data['contact'] ?? '');

// Validate required fields
if (!$name || !$email || !$password) {
    send_json(["message" => "All fields are required."], 400);
    exit;
}


$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users (name, email, role, contact, password, reset_token, status) VALUES (?, ?, 'COMPANY', ?, ?, NULL, 'PENDING')");

if (!$stmt) {
    send_json(["message" => "Failed to prepare statement: " . $conn->error], 500);
    exit;
}

$stmt->bind_param("ssss", $name, $email, $contact, $hashedPassword);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    send_json([
        "message" => "Company user registration submitted for approval.",
        "user_id" => $userId
    ]);
} else {
    if ($conn->errno === 1062) { 
        send_json(["message" => "Email already exists."], 409);
    } else {
        send_json(["message" => "Registration failed: " . $stmt->error], 500);
    }
}

$stmt->close();
$conn->close();
?>