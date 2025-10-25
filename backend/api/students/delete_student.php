<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config.php';
require_once '../../utils.php';

$studentId = $_GET['id'] ?? null;

if (!$studentId) {
    send_json(['success' => false, 'message' => 'Student ID is required'], 400);
}

// Get user_id first
$stmt = $conn->prepare("SELECT user_id FROM students WHERE student_id = ?");
$stmt->bind_param("i", $studentId);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

if ($result) {
    // Delete student record (user will be deleted by CASCADE)
    $stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $result['user_id']);
    
    if ($stmt->execute()) {
        send_json(['success' => true, 'message' => 'Student deleted successfully']);
    } else {
        send_json(['success' => false, 'message' => 'Failed to delete student'], 500);
    }
} else {
    send_json(['success' => false, 'message' => 'Student not found'], 404);
}
?>