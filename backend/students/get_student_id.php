<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    send_json(['error' => 'User ID is required'], 400);
}

$stmt = $conn->prepare("SELECT student_id FROM students WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $student = $result->fetch_assoc();
    send_json(['student_id' => $student['student_id']]);
} else {
    send_json(['error' => 'Student not found'], 404);
}

$stmt->close();
$conn->close();
?>