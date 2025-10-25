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

// Simple feedback report - get all reviews
$stmt = $conn->prepare("SELECT * FROM reviews ORDER BY student_id");
$stmt->execute();
$result = $stmt->get_result();

$feedback = [];
while ($row = $result->fetch_assoc()) {
    $feedback[] = [
        'student_name' => 'Student ' . $row['student_id'],
        'student_id' => $row['student_id'],
        'course_name' => 'Course',
        'company_name' => 'Company',
        'rating' => $row['rating'],
        'review_text' => $row['review_text'],
        'application_status' => 'Active',
        'created_at' => $row['created_at']
    ];
}

send_json($feedback);
?>