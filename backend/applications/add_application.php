<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

// Debug: Log all received data
error_log('POST data: ' . print_r($_POST, true));
error_log('FILES data: ' . print_r($_FILES, true));

$student_id = isset($_POST['student_id']) ? $_POST['student_id'] : null;
$internship_id = isset($_POST['internship_id']) ? $_POST['internship_id'] : null;

error_log('Student ID: ' . $student_id);
error_log('Internship ID: ' . $internship_id);

if (!$student_id || !$internship_id) {
    die(json_encode(['status' => 'error', 'message' => 'Student ID or Internship ID missing. Received: student_id=' . $student_id . ', internship_id=' . $internship_id]));
}

// Check if student_id exists in students table, if not, assume it's user_id and convert
$checkStudentStmt = $conn->prepare("SELECT student_id FROM students WHERE student_id = ?");
$checkStudentStmt->bind_param("i", $student_id);
$checkStudentStmt->execute();
$checkStudentResult = $checkStudentStmt->get_result();

if ($checkStudentResult->num_rows == 0) {
    // student_id doesn't exist, try to find by user_id
    $getUserStmt = $conn->prepare("SELECT student_id FROM students WHERE user_id = ?");
    $getUserStmt->bind_param("i", $student_id);
    $getUserStmt->execute();
    $getUserResult = $getUserStmt->get_result();
    
    if ($getUserResult->num_rows > 0) {
        $studentData = $getUserResult->fetch_assoc();
        $student_id = $studentData['student_id'];
        error_log('Converted user_id to student_id: ' . $student_id);
    } else {
        die(json_encode(['status' => 'error', 'message' => 'Student not found']));
    }
    $getUserStmt->close();
}
$checkStudentStmt->close();

// Check if internship deadline has passed
$deadlineStmt = $conn->prepare("SELECT deadline FROM internships WHERE internship_id = ?");
$deadlineStmt->bind_param("i", $internship_id);
$deadlineStmt->execute();
$deadlineResult = $deadlineStmt->get_result();
$internship = $deadlineResult->fetch_assoc();

if ($internship && $internship['deadline'] < date('Y-m-d')) {
    die(json_encode(['status' => 'error', 'message' => 'Cannot apply for expired internship']));
}
$deadlineStmt->close();

$checkStmt = $conn->prepare("SELECT application_id FROM applications WHERE student_id = ? AND internship_id = ?");
$checkStmt->bind_param("ii", $student_id, $internship_id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    http_response_code(400);
    echo json_encode(['message' => 'You have already applied for this internship']);
    exit;
}
$checkStmt->close();

$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$cvPath = $transcriptPath = $letterPath = null;

if (isset($_FILES['cv'])) {
    $fileName = uniqid() . '_' . basename($_FILES['cv']['name']);
    $targetPath = $uploadDir . $fileName;
    if (move_uploaded_file($_FILES['cv']['tmp_name'], $targetPath)) {
        $cvPath = 'uploads/' . $fileName;
    }
}
if (isset($_FILES['transcript'])) {
    $fileName = uniqid() . '_' . basename($_FILES['transcript']['name']);
    $targetPath = $uploadDir . $fileName;
    if (move_uploaded_file($_FILES['transcript']['tmp_name'], $targetPath)) {
        $transcriptPath = 'uploads/' . $fileName;
    }
}
if (isset($_FILES['letter'])) {
    $fileName = uniqid() . '_' . basename($_FILES['letter']['name']);
    $targetPath = $uploadDir . $fileName;
    if (move_uploaded_file($_FILES['letter']['tmp_name'], $targetPath)) {
        $letterPath = 'uploads/' . $fileName;
    }
}

$stmt = $conn->prepare("INSERT INTO applications (student_id, internship_id, cv_path, transcript_path, application_letter_path, status) VALUES (?, ?, ?, ?, ?, 'PENDING')");
$stmt->bind_param("iisss", $student_id, $internship_id, $cvPath, $transcriptPath, $letterPath);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Application submitted']);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}
$stmt->close();
$conn->close();
?>