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

if (!$input || !isset($input['lecturer_id']) || !isset($input['course_id'])) {
    send_json(['success' => false, 'message' => 'Missing required fields'], 400);
}

// Check if assignment already exists
$stmt = $conn->prepare("SELECT id FROM lecturer_courses WHERE lecturer_id = ? AND course_id = ?");
$stmt->bind_param("ii", $input['lecturer_id'], $input['course_id']);
$stmt->execute();
if ($stmt->get_result()->fetch_assoc()) {
    send_json(['success' => false, 'message' => 'Lecturer already assigned to this course'], 400);
}

// Insert assignment
$stmt = $conn->prepare("INSERT INTO lecturer_courses (lecturer_id, course_id) VALUES (?, ?)");
$stmt->bind_param("ii", $input['lecturer_id'], $input['course_id']);

if ($stmt->execute()) {
    send_json(['success' => true, 'message' => 'Course assigned successfully']);
} else {
    send_json(['success' => false, 'message' => 'Failed to assign course'], 500);
}
?>