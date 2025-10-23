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

// Get school name
$schoolResult = $conn->prepare("SELECT name FROM schools WHERE school_id = ?");
$schoolResult->bind_param("i", $schoolId);
$schoolResult->execute();
$school = $schoolResult->get_result()->fetch_assoc();

if (!$school) {
    send_json(['success' => false, 'message' => 'School not found'], 404);
}

// Get courses count
$coursesResult = $conn->prepare("SELECT COUNT(*) as count FROM courses WHERE school_id = ?");
$coursesResult->bind_param("i", $schoolId);
$coursesResult->execute();
$coursesCount = $coursesResult->get_result()->fetch_assoc()['count'];

// Get lecturers count
$lecturersResult = $conn->prepare("SELECT COUNT(*) as count FROM lecturers WHERE school_id = ?");
$lecturersResult->bind_param("i", $schoolId);
$lecturersResult->execute();
$lecturersCount = $lecturersResult->get_result()->fetch_assoc()['count'];

// Get students count
$studentsResult = $conn->prepare("SELECT COUNT(*) as count FROM students WHERE school_id = ?");
$studentsResult->bind_param("i", $schoolId);
$studentsResult->execute();
$studentsCount = $studentsResult->get_result()->fetch_assoc()['count'];

// Get applications count for this school's students
$applicationsResult = $conn->prepare("
    SELECT COUNT(*) as count 
    FROM applications a 
    JOIN students s ON a.student_id = s.student_id 
    WHERE s.school_id = ?
");
$applicationsResult->bind_param("i", $schoolId);
$applicationsResult->execute();
$applicationsCount = $applicationsResult->get_result()->fetch_assoc()['count'];

$response = [
    'school_name' => $school['name'],
    'stats' => [
        'courses' => (int)$coursesCount,
        'lecturers' => (int)$lecturersCount,
        'students' => (int)$studentsCount,
        'applications' => (int)$applicationsCount
    ]
];

send_json($response);
?>