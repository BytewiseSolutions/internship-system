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

// Get all students (simplified)
$stmt = $conn->prepare("
    SELECT 
        u.user_id,
        u.name,
        u.email,
        s.student_id,
        'Course' as course_name,
        'Not assigned' as company_name,
        'No Application' as internship_status
    FROM users u
    JOIN students s ON u.user_id = s.user_id
    WHERE u.role = 'student'
    ORDER BY u.name
");

// No parameter needed for simplified query
$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

send_json($students);
?>