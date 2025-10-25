<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$company_id = $_GET['id'] ?? null;

if (!$company_id) {
    send_json(['success' => false, 'message' => 'Company ID is required'], 400);
}

$stmt = $conn->prepare("DELETE FROM companies WHERE company_id = ?");
$stmt->bind_param("i", $company_id);

if ($stmt->execute()) {
    send_json(['success' => true, 'message' => 'Company deleted successfully']);
} else {
    send_json(['success' => false, 'message' => 'Failed to delete company'], 500);
}

$stmt->close();
$conn->close();
?>