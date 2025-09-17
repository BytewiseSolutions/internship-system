<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['name'], $data['email'], $data['industry'], $data['createdAt'], $data['status'])) {
    send_json(["message" => "Missing required fields"], 400);
}

$name = $data['name'];
$email = $data['email'];
$industry = $data['industry'];
$createdAt = date('Y-m-d', strtotime($data['createdAt']));
$status = $data['status'];

$stmt = $conn->prepare("INSERT INTO companies (name, email, industry, created_at, status) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $name, $email, $industry, $createdAt, $status);

if ($stmt->execute()) {
    $companyId = $stmt->insert_id;

    $defaultPassword = password_hash('Company@123', PASSWORD_DEFAULT);
    $userRole = 'COMPANY';
    $contact = '';
    $resetToken = null;

    $stmtUser = $conn->prepare("INSERT INTO users (name, email, role, contact, password, reset_token, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmtUser->bind_param("sssssss", $name, $email, $userRole, $contact, $defaultPassword, $resetToken, $status);
    $stmtUser->execute();
    $stmtUser->close();

    send_json([
        "id" => $companyId,
        "name" => $name,
        "email" => $email,
        "industry" => $industry,
        "createdAt" => $createdAt,
        "status" => $status
    ]);
} else {
    send_json(["message" => "Failed to add company"], 500);
}

$stmt->close();
$conn->close();
?>