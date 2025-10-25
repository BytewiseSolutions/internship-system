<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['company_id'], $data['status'])) {
    send_json(['success' => false, 'message' => 'Missing required fields'], 400);
}

$company_id = $data['company_id'];
$status = $data['status'];

$stmt = $conn->prepare("UPDATE companies SET status = ? WHERE company_id = ?");
$stmt->bind_param("si", $status, $company_id);

if ($stmt->execute()) {
    send_json(['success' => true, 'message' => 'Company status updated successfully']);
} else {
    send_json(['success' => false, 'message' => 'Failed to update company status'], 500);
}

$stmt->close();
$conn->close();
?>