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

$sql = "SELECT l.lecturer_id, u.name, u.email FROM lecturers l JOIN users u ON l.user_id = u.user_id WHERE l.school_id = ?";
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