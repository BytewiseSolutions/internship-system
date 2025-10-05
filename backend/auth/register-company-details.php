<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';
require_once __DIR__ . "/notify_admin.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'] ?? null;
$companyName = trim($data['name'] ?? '');
$companyEmail = trim($data['email'] ?? '');
$industry = trim($data['industry'] ?? '');
$status = $data['status'] ?? 'ACTIVE';
$created_at = date('Y-m-d');

if (!$user_id || !$companyName || !$companyEmail || !$industry) {
    send_json(["message" => "All fields are required."], 400);
    exit;
}

$stmt = $conn->prepare("INSERT INTO companies (name, email, industry, created_at, status, user_id) VALUES (?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    send_json(["message" => "Failed to prepare query: " . $conn->error], 500);
    exit;
}

$stmt->bind_param("sssssi", $companyName, $companyEmail, $industry, $created_at, $status, $user_id);

if (!$stmt->execute()) {
    send_json(["message" => "Company registration failed: " . $stmt->error], 500);
    exit;
}

$stmt->close();

notifyAdmins("COMPANY");

send_json(["message" => "Company registered successfully."]);
