<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';

$student_id = isset($_GET['student_id']) ? $_GET['student_id'] : null;

if (!$student_id) {
    echo json_encode(['status' => 'error', 'message' => 'Student ID required']);
    exit;
}

$stmt = $conn->prepare("SELECT COUNT(*) as count FROM applications WHERE student_id = ? AND status = 'ACCEPTED'");
$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

echo json_encode(['hasAcceptedInternship' => $row['count'] > 0]);

$stmt->close();
$conn->close();
?>