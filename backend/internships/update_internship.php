<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$id = $_GET['id'];
$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? '';
$company_id = $data['company_id'] ?? null;
$location = $data['location'] ?? '';
$postedDate = $data['postedDate'] ?? null;
$deadline = $data['deadline'] ?? null;
$description = $data['description'] ?? '';
$status = $data['status'] ?? 'Active';

$stmt = $conn->prepare("
    UPDATE internships 
    SET title=?, company_id=?, location=?, postedDate=?, deadline=?, description=?, status=? 
    WHERE id=?
");

$stmt->bind_param("sisssssi", $title, $company_id, $location, $postedDate, $deadline, $description, $status, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => $stmt->error]);
}

$stmt->close();
?>