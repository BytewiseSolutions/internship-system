<?php
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../utils.php';

$school_id = $_GET['id'] ?? null;

if (!$school_id) {
    send_json(['success' => false, 'message' => 'School ID is required'], 400);
}

$stmt = $conn->prepare("DELETE FROM schools WHERE school_id = ?");
$stmt->bind_param("i", $school_id);

if ($stmt->execute()) {
    send_json(['success' => true, 'message' => 'School deleted successfully']);
} else {
    send_json(['success' => false, 'message' => 'Failed to delete school'], 500);
}

$stmt->close();
$conn->close();
?>