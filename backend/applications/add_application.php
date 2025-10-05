<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$student_id = isset($_POST['student_id']) ? $_POST['student_id'] : null;
$internship_id = isset($_POST['internship_id']) ? $_POST['internship_id'] : null;

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

if (!$student_id || !$internship_id) {
    die(json_encode(['status' => 'error', 'message' => 'Student ID or Internship ID missing']));
}

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

$stmt = $conn->prepare("INSERT INTO applications (student_id, internship_id, cvPath, transcriptPath, applicationLetterPath, status) VALUES (?, ?, ?, ?, ?, 'PENDING')");
$stmt->bind_param("iisss", $student_id, $internship_id, $cvPath, $transcriptPath, $letterPath);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Application submitted']);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}
$stmt->close();
$conn->close();
?>