<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'], $data['status'])) {
    echo json_encode(['status' => 'error', 'message' => 'Application ID or status missing']);
    exit;
}

$id = $data['id'];
$status = strtoupper($data['status']);

$stmt = $conn->prepare("UPDATE applications SET status=? WHERE id=?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Application status updated']);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>