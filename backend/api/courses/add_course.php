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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['course_name']) || !isset($input['school_id'])) {
    send_json(['success' => false, 'message' => 'Missing required fields'], 400);
}

$stmt = $conn->prepare("INSERT INTO courses (school_id, course_name) VALUES (?, ?)");
$stmt->bind_param("is", $input['school_id'], $input['course_name']);

if ($stmt->execute()) {
    send_json(['success' => true, 'message' => 'Course added successfully']);
} else {
    send_json(['success' => false, 'message' => 'Failed to add course'], 500);
}
?>