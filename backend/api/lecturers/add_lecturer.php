<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config.php';
require_once '../../utils.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['name']) || !isset($input['email']) || !isset($input['school_id'])) {
    send_json(['success' => false, 'message' => 'Missing required fields'], 400);
}

// Check if email already exists
$stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$stmt->bind_param("s", $input['email']);
$stmt->execute();
if ($stmt->get_result()->fetch_assoc()) {
    send_json(['success' => false, 'message' => 'Email already exists'], 400);
}

// Insert user
$stmt = $conn->prepare("INSERT INTO users (name, email, password, role, school_id) VALUES (?, ?, ?, 'LECTURER', ?)");
$defaultPassword = password_hash('password', PASSWORD_DEFAULT);
$stmt->bind_param("sssi", $input['name'], $input['email'], $defaultPassword, $input['school_id']);

if ($stmt->execute()) {
    $userId = $conn->insert_id;
    
    // Insert lecturer
    $stmt = $conn->prepare("INSERT INTO lecturers (user_id, school_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $userId, $input['school_id']);
    
    if ($stmt->execute()) {
        send_json(['success' => true, 'message' => 'Lecturer added successfully']);
    } else {
        send_json(['success' => false, 'message' => 'Failed to add lecturer'], 500);
    }
} else {
    send_json(['success' => false, 'message' => 'Failed to create user'], 500);
}
?>