<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$student_id = $_GET['student_id'] ?? null;

if (!$student_id) {
    send_json(['error' => 'Student ID is required'], 400);
}

// Debug: log the student_id being used
error_log("Dashboard stats requested for student_id: " . $student_id);

// Get total applications count
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM applications WHERE student_id = ?");
$stmt->bind_param("i", $student_id);
$stmt->execute();
$total_applications = $stmt->get_result()->fetch_assoc()['count'];

// Get approved applications count (case insensitive)
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM applications WHERE student_id = ? AND UPPER(status) = 'ACCEPTED'");
$stmt->bind_param("i", $student_id);
$stmt->execute();
$approved_applications = $stmt->get_result()->fetch_assoc()['count'];

// Get pending applications count (case insensitive)
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM applications WHERE student_id = ? AND UPPER(status) = 'PENDING'");
$stmt->bind_param("i", $student_id);
$stmt->execute();
$pending_applications = $stmt->get_result()->fetch_assoc()['count'];

// Get reviews count
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM reviews WHERE student_id = ? AND status = 'APPROVED'");
$stmt->bind_param("i", $student_id);
$stmt->execute();
$reviews = $stmt->get_result()->fetch_assoc()['count'];

// Get notifications count
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0");
$stmt->bind_param("i", $student_id);
$stmt->execute();
$notifications = $stmt->get_result()->fetch_assoc()['count'];

// Get available internships count
$internships_result = $conn->query("SELECT COUNT(*) as count FROM internships WHERE status = 'ACTIVE'");
$internships = $internships_result->fetch_assoc()['count'];

send_json([
    'applications' => (int)$total_applications,
    'approved_applications' => (int)$approved_applications,
    'pending_applications' => (int)$pending_applications,
    'reviews' => (int)$reviews,
    'notifications' => (int)$notifications,
    'internships' => (int)$internships
]);
?>