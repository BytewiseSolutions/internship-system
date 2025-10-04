<?php
require 'cors.php';
require 'config.php';
require 'utils.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['name'], $data['email'], $data['contact'], $data['password'], $data['role'])) {
    send_json(["message" => "Missing required fields"], 400);
}

$name = $conn->real_escape_string($data['name']);
$email = $conn->real_escape_string($data['email']);
$contact = $conn->real_escape_string($data['contact']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$role = strtoupper($conn->real_escape_string($data['role']));

$check = $conn->prepare("SELECT id FROM users WHERE email=?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();
if ($check->num_rows > 0) {
    send_json(["message" => "Email already registered."], 409);
}
$check->close();

$stmt = $conn->prepare("INSERT INTO users (name, email, role, contact, password, status) VALUES (?, ?, ?, ?, ?, 'PENDING')");
$stmt->bind_param("sssss", $name, $email, $role, $contact, $password);

if ($stmt->execute()) {
    send_json(["message" => "Registration successful. Awaiting approval."]);
} else {
    send_json(["message" => "Registration failed: " . $conn->error], 500);
}

$stmt->close();
$conn->close();
?>