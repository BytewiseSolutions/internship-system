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

// Simple logbook report - get all logbook entries
$stmt = $conn->prepare("SELECT * FROM logbook ORDER BY student_id, week_number");
$stmt->execute();
$result = $stmt->get_result();

$logbooks = [];
while ($row = $result->fetch_assoc()) {
    $logbooks[] = [
        'student_name' => 'Student ' . ($row['student_id'] ?? 'Unknown'),
        'student_id' => $row['student_id'] ?? 0,
        'course_name' => 'Course',
        'week_number' => $row['week_number'] ?? 0,
        'activities' => $row['activities'] ?? '',
        'skills_learned' => $row['skills_learned'] ?? '',
        'challenges' => $row['challenges'] ?? '',
        'created_at' => $row['created_at'] ?? ''
    ];
}

send_json($logbooks);
?>