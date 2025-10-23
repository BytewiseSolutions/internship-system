<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config.php';
require_once '../../utils.php';

$schoolId = $_GET['school_id'] ?? null;

if (!$schoolId) {
    send_json(['success' => false, 'message' => 'School ID is required'], 400);
}

$sql = "SELECT s.student_id, u.name, u.email, c.course_name 
        FROM students s 
        JOIN users u ON s.user_id = u.user_id 
        JOIN courses c ON s.course_id = c.course_id 
        WHERE s.school_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $schoolId);
$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

send_json($students);
?>