<?php
require_once '../cors.php';
require_once '../utils.php';
require './config.php';

$student_id = isset($_GET['student_id']) ? (int) $_GET['student_id'] : null;

if (!$student_id) {
    send_json(['status' => 'error', 'message' => 'Student ID is required'], 400);
}

$sql = "
SELECT i.id AS internship_id, i.title AS internship_title, i.company_id, c.name AS company_name FROM applications a JOIN internships i ON a.internship_id = i.id LEFT JOIN companies c ON i.company_id = c.id WHERE a.student_id = ? AND a.status='ACCEPTED' ORDER BY a.created_at DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();

$internships = [];
while ($row = $result->fetch_assoc()) {
    $internships[] = $row;
}

send_json($internships);

$stmt->close();
$conn->close();
?>