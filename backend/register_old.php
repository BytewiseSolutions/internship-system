<?php
require_once 'cors.php';
require_once 'utils.php';
require_once 'config.php';

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

// Set status based on role
$status = ($role === 'STUDENT') ? 'PENDING' : 'ACTIVE';

$stmt = $conn->prepare("INSERT INTO users (name, email, role, contact, password, status) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $name, $email, $role, $contact, $password, $status);

if ($stmt->execute()) {
    $message = ($role === 'STUDENT') ? "Registration successful. Awaiting admin approval." : "Registration successful.";
    send_json(["message" => $message]);
} else {
    send_json(["message" => "Registration failed: " . $conn->error], 500);
}

$stmt->close();
$conn->close();
?>