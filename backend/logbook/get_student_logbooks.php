<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$student_id = $_GET['student_id'];

// Get student_id from user_id
$userStmt = $conn->prepare("SELECT student_id FROM students WHERE user_id = ?");
$userStmt->bind_param("i", $student_id);
$userStmt->execute();
$userResult = $userStmt->get_result();
$studentData = $userResult->fetch_assoc();
$actual_student_id = $studentData['student_id'];

$stmt = $conn->prepare("SELECT * FROM logbook WHERE student_id = ? ORDER BY week_number DESC");
$stmt->bind_param("i", $actual_student_id);
$stmt->execute();
$result = $stmt->get_result();
$logbooks = $result->fetch_all(MYSQLI_ASSOC);

send_json($logbooks);
$stmt->close();
$conn->close();
?>