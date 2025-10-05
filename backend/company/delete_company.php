<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$id = $_GET['id'] ?? null;
if (!$id)
    send_json(["message" => "Company ID required"], 400);

$stmt = $conn->prepare("DELETE FROM companies WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    send_json(["message" => "Company deleted"]);
} else {
    send_json(["message" => "Failed to delete company"], 500);
}
