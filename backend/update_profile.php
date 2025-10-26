<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';
require_once 'utils.php';

$input = json_decode(file_get_contents('php://input'), true);

$user_id = $input['user_id'] ?? null;
$name = $input['name'] ?? null;
$email = $input['email'] ?? null;

if (!$user_id || !$name || !$email) {
    send_json(['success' => false, 'message' => 'User ID, name, and email are required'], 400);
}

try {
    // Check if email is already taken by another user
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ? AND user_id != ?");
    $stmt->bind_param('si', $email, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        send_json(['success' => false, 'message' => 'Email is already taken'], 400);
    }
    
    // Update user profile
    $stmt = $conn->prepare("UPDATE users SET name = ?, email = ? WHERE user_id = ?");
    $stmt->bind_param('ssi', $name, $email, $user_id);
    
    if ($stmt->execute()) {
        send_json(['success' => true, 'message' => 'Profile updated successfully']);
    } else {
        send_json(['success' => false, 'message' => 'Failed to update profile'], 500);
    }
    
} catch (Exception $e) {
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>