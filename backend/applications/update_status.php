<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';
require_once '../utils.php';

$input = json_decode(file_get_contents('php://input'), true);
$applicationId = $input['application_id'] ?? null;
$status = $input['status'] ?? null;

if (!$applicationId || !$status) {
    send_json(['success' => false, 'message' => 'Application ID and status are required'], 400);
}

$stmt = $conn->prepare("UPDATE applications SET status = ? WHERE application_id = ?");
$stmt->bind_param("si", $status, $applicationId);

if ($stmt->execute()) {
    send_json(['success' => true, 'message' => 'Application status updated successfully']);
} else {
    send_json(['success' => false, 'message' => 'Failed to update application status'], 500);
}
?>