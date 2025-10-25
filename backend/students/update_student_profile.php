<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';
require_once '../utils.php';

$input = json_decode(file_get_contents('php://input'), true);

$user_id = $input['user_id'] ?? null;
$name = $input['name'] ?? null;
$email = $input['email'] ?? null;
$phone = $input['phone'] ?? null;
$course = $input['course'] ?? null;
$year_of_study = $input['year_of_study'] ?? null;

if (!$user_id || !$name || !$email) {
    send_json(['success' => false, 'message' => 'Required fields missing'], 400);
}

try {
    $conn->begin_transaction();
    
    // Update users table
    $stmt = $conn->prepare("UPDATE users SET name = ?, email = ? WHERE user_id = ?");
    $stmt->bind_param('ssi', $name, $email, $user_id);
    $stmt->execute();
    
    // Update students table
    $stmt = $conn->prepare("UPDATE students SET course_id = ? WHERE user_id = ?");
    $stmt->bind_param('ii', $course, $user_id);
    $stmt->execute();
    
    $conn->commit();
    send_json(['success' => true, 'message' => 'Profile updated successfully']);
    
} catch (Exception $e) {
    $conn->rollback();
    send_json(['success' => false, 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>