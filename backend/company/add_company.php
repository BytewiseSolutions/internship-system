<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$data = json_decode(file_get_contents("php://input"), true);

if (
    !$data || !isset(
    $data['user']['name'],
    $data['user']['email'],
    $data['user']['password'],
    $data['company']['name'],
    $data['company']['email'],
    $data['company']['industry'],
    $data['company']['status']
)
) {
    send_json(["message" => "Missing required fields"], 400);
    exit;
}

$userName = trim($data['user']['name']);
$userEmail = trim($data['user']['email']);
$userPassword = $data['user']['password'];
$userContact = $data['user']['contact'] ?? '';
$companyStatus = $data['company']['status'];

$companyName = trim($data['company']['name']);
$companyEmail = trim($data['company']['email']);
$companyIndustry = $data['company']['industry'];
$companyCreatedAt = date('Y-m-d', strtotime($data['company']['createdAt'] ?? 'now'));

$hashedPassword = password_hash($userPassword, PASSWORD_BCRYPT);

$conn->begin_transaction();
try {
    $stmtUser = $conn->prepare("INSERT INTO users (name, email, role, contact, password, reset_token, status) VALUES (?, ?, 'COMPANY', ?, ?, NULL, ?)");
    if (!$stmtUser)
        throw new Exception("Prepare user failed: " . $conn->error);
    $stmtUser->bind_param("sssss", $userName, $userEmail, $userContact, $hashedPassword, $companyStatus);
    if (!$stmtUser->execute())
        throw new Exception("User insert failed: " . $stmtUser->error);
    $userId = $stmtUser->insert_id;
    $stmtUser->close();

    $stmtCompany = $conn->prepare("INSERT INTO companies (name, email, industry, created_at, status, user_id) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmtCompany)
        throw new Exception("Prepare company failed: " . $conn->error);
    $stmtCompany->bind_param("sssssi", $companyName, $companyEmail, $companyIndustry, $companyCreatedAt, $companyStatus, $userId);
    if (!$stmtCompany->execute())
        throw new Exception("Company insert failed: " . $stmtCompany->error);
    $companyId = $stmtCompany->insert_id;
    $stmtCompany->close();

    $conn->commit();

    send_json([
        "id" => $companyId,
        "name" => $companyName,
        "email" => $companyEmail,
        "industry" => $companyIndustry,
        "createdAt" => $companyCreatedAt,
        "status" => $companyStatus,
        "user_id" => $userId
    ]);

} catch (Exception $e) {
    $conn->rollback();
    send_json(["message" => "Failed to add company: " . $e->getMessage()], 500);
}

$conn->close();
?>