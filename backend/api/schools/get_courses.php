<?php
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../utils.php';

$school_id = $_GET['school_id'] ?? null;

if (!$school_id) {
    send_json(['error' => 'School ID required'], 400);
}

$stmt = $conn->prepare("SELECT course_id, course_name FROM courses WHERE school_id = ?");
$stmt->bind_param("i", $school_id);
$stmt->execute();
$result = $stmt->get_result();
$courses = $result->fetch_all(MYSQLI_ASSOC);

send_json($courses);
$stmt->close();
$conn->close();
?>