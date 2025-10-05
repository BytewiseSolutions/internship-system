<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$data = json_decode(file_get_contents("php://input"), true);

$student_id = $data['student_id'] ?? null;
$internship_id = $data['internship_id'] ?? null;
$rating = $data['rating'] ?? null;
$comment = $data['comment'] ?? '';

if (!$student_id || !$internship_id || !$rating || $rating < 1 || $rating > 5) {
    send_json(['status' => 'error', 'message' => 'Invalid data'], 400);
}

$checkSql = "SELECT status FROM applications WHERE student_id=? AND internship_id=? AND status='ACCEPTED'";
$stmtCheck = $conn->prepare($checkSql);
$stmtCheck->bind_param("ii", $student_id, $internship_id);
$stmtCheck->execute();
$result = $stmtCheck->get_result();

if ($result->num_rows === 0) {
    send_json(['status' => 'error', 'message' => 'You are not eligible to review this internship'], 403);
}

$companySql = "SELECT company_id FROM internships WHERE id=?";
$stmtCompany = $conn->prepare($companySql);
$stmtCompany->bind_param("i", $internship_id);
$stmtCompany->execute();
$companyResult = $stmtCompany->get_result();
$companyRow = $companyResult->fetch_assoc();
$company_id = $companyRow['company_id'] ?? null;

if (!$company_id) {
    send_json(['status' => 'error', 'message' => 'Internship not found'], 404);
}

$insertSql = "INSERT INTO reviews (student_id, internship_id, company_id, rating, comment) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($insertSql);
$stmt->bind_param("iiiis", $student_id, $internship_id, $company_id, $rating, $comment);

if ($stmt->execute()) {
    send_json(['status' => 'success', 'message' => 'Review submitted']);
} else {
    send_json(['status' => 'error', 'message' => $stmt->error], 500);
}

$stmt->close();
$conn->close();

?>