<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$data = json_decode(file_get_contents('php://input'), true);

$student_id = $data['student_id'];
$week_number = $data['week_number'];
$week_ending = $data['week_ending'];
$activities_completed = $data['activities_completed'];
$skills_learned = $data['skills_learned'];
$challenges_faced = $data['challenges_faced'];

// Get student_id from user_id
$userStmt = $conn->prepare("SELECT student_id FROM students WHERE user_id = ?");
$userStmt->bind_param("i", $student_id);
$userStmt->execute();
$userResult = $userStmt->get_result();
$studentData = $userResult->fetch_assoc();
$actual_student_id = $studentData['student_id'];

$stmt = $conn->prepare("INSERT INTO logbook (student_id, week_number, week_ending, activities_completed, skills_learned, challenges_faced) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("iissss", $actual_student_id, $week_number, $week_ending, $activities_completed, $skills_learned, $challenges_faced);

if ($stmt->execute()) {
    send_json(['success' => true, 'message' => 'Logbook entry added successfully']);
} else {
    send_json(['success' => false, 'message' => 'Failed to add logbook entry']);
}

$stmt->close();
$conn->close();
?>