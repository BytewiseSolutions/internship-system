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

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    send_json(['success' => false, 'message' => 'User ID is required'], 400);
}

// Get lecturer_id
$stmt = $conn->prepare("SELECT lecturer_id, school_id FROM lecturers WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$lecturer = $stmt->get_result()->fetch_assoc();

if (!$lecturer) {
    send_json(['success' => false, 'message' => 'Lecturer not found'], 404);
}

$lecturerId = $lecturer['lecturer_id'];
$schoolId = $lecturer['school_id'];

// Get assigned courses count
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM lecturer_courses WHERE lecturer_id = ?");
$stmt->bind_param("i", $lecturerId);
$stmt->execute();
$coursesCount = $stmt->get_result()->fetch_assoc()['count'];

// Get students count (students in lecturer's courses)
$stmt = $conn->prepare("
    SELECT COUNT(DISTINCT s.student_id) as count 
    FROM students s 
    JOIN lecturer_courses lc ON s.course_id = lc.course_id 
    WHERE lc.lecturer_id = ?
");
$stmt->bind_param("i", $lecturerId);
$stmt->execute();
$studentsCount = $stmt->get_result()->fetch_assoc()['count'];

// Get logbook entries count for lecturer's students
$stmt = $conn->prepare("
    SELECT COUNT(*) as count 
    FROM logbook l 
    JOIN students s ON l.student_id = s.student_id 
    JOIN lecturer_courses lc ON s.course_id = lc.course_id 
    WHERE lc.lecturer_id = ?
");
$stmt->bind_param("i", $lecturerId);
$stmt->execute();
$logbooksCount = $stmt->get_result()->fetch_assoc()['count'];

// Get applications count for lecturer's students
$stmt = $conn->prepare("
    SELECT COUNT(*) as count 
    FROM applications a 
    JOIN students s ON a.student_id = s.student_id 
    JOIN lecturer_courses lc ON s.course_id = lc.course_id 
    WHERE lc.lecturer_id = ?
");
$stmt->bind_param("i", $lecturerId);
$stmt->execute();
$applicationsCount = $stmt->get_result()->fetch_assoc()['count'];

$stats = [
    'students' => (int)$studentsCount,
    'courses' => (int)$coursesCount,
    'logbooks' => (int)$logbooksCount,
    'applications' => (int)$applicationsCount
];

send_json($stats);
?>