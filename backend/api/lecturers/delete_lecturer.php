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

$lecturerId = $_GET['id'] ?? null;

if (!$lecturerId) {
    send_json(['success' => false, 'message' => 'Lecturer ID is required'], 400);
}

// Delete lecturer from users table
$stmt = $conn->prepare("DELETE FROM users WHERE user_id = ? AND role = 'lecturer'");
$stmt->bind_param("i", $lecturerId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        send_json(['success' => true, 'message' => 'Lecturer deleted successfully']);
    } else {
        send_json(['success' => false, 'message' => 'Lecturer not found'], 404);
    }
} else {
    send_json(['success' => false, 'message' => 'Failed to delete lecturer'], 500);
}
?>