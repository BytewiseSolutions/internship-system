<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'];
$company_id = $data['company_id'];
$location = $data['location'];
$postedDate = $data['postedDate'];
$deadline = $data['deadline'];
$description = $data['description'];
$status = $data['status'] ?? 'Active';

$sql = "INSERT INTO internships (title, company_id, location, postedDate, deadline, description, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sisssss", $title, $company_id, $location, $postedDate, $deadline, $description, $status);
if ($stmt->execute()) {
    echo json_encode([
        'id' => $stmt->insert_id,
        'title' => $title,
        'company_id' => $company_id,
        'location' => $location,
        'postedDate' => $postedDate,
        'deadline' => $deadline,
        'description' => $description,
        'status' => $status
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => $stmt->error]);
}
$stmt->close();
$conn->close();
?>