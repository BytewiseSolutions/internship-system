<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$id = $_GET['id'] ?? null;
if (!$id) {
    send_json(["message" => "Company ID required"], 400);
}

$stmt = $conn->prepare("SELECT * FROM companies WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
if ($company = $result->fetch_assoc()) {
    send_json($company);
} else {
    send_json(["message" => "Company not found"], 404);
}
