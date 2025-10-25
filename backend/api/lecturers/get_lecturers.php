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

$sql = "SELECT u.user_id as lecturer_id, u.name, u.email,
              GROUP_CONCAT(c.course_name SEPARATOR ', ') as assigned_courses
         FROM users u 
         LEFT JOIN lecturer_courses lc ON u.user_id = lc.lecturer_id
         LEFT JOIN courses c ON lc.course_id = c.course_id
         WHERE u.role = 'LECTURER' AND u.school_id = ?
         GROUP BY u.user_id, u.name, u.email";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $schoolId);
$stmt->execute();
$result = $stmt->get_result();

$lecturers = [];
while ($row = $result->fetch_assoc()) {
    $lecturers[] = $row;
}

send_json($lecturers);
?>