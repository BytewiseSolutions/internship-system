<?php
require '../config.php';
require '../cors.php';

$student_id = $_POST['student_id'];
$internship_id = $_POST['internship_id'];

$checkStmt = $conn->prepare("SELECT id FROM applications WHERE student_id = ? AND internship_id = ?");
$checkStmt->bind_param("ii", $student_id, $internship_id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    http_response_code(400);
    echo json_encode(['message' => 'You have already applied for this internship']);
    exit;
}
$checkStmt->close();

$cvPath = $transcriptPath = $letterPath = null;

$uploadDir = 'uploads/';
if (!is_dir($uploadDir))
    mkdir($uploadDir, 0777, true);

if (isset($_FILES['cv'])) {
    $cvPath = $uploadDir . uniqid() . '_' . $_FILES['cv']['name'];
    move_uploaded_file($_FILES['cv']['tmp_name'], $cvPath);
}
if (isset($_FILES['transcript'])) {
    $transcriptPath = $uploadDir . uniqid() . '_' . $_FILES['transcript']['name'];
    move_uploaded_file($_FILES['transcript']['tmp_name'], $transcriptPath);
}
if (isset($_FILES['letter'])) {
    $letterPath = $uploadDir . uniqid() . '_' . $_FILES['letter']['name'];
    move_uploaded_file($_FILES['letter']['tmp_name'], $letterPath);
}

$stmt = $conn->prepare("INSERT INTO applications 
(student_id, internship_id, cvPath, transcriptPath, applicationLetterPath, status) 
VALUES (?, ?, ?, ?, ?, 'PENDING')");
$stmt->bind_param("iisss", $student_id, $internship_id, $cvPath, $transcriptPath, $letterPath);
if ($stmt->execute()) {
    echo json_encode(['message' => 'Application submitted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to submit application']);
}
$stmt->close();
$conn->close();
?>