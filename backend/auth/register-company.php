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

$data = json_decode(file_get_contents("php://input"), true);

$companyName = trim($data['company_name'] ?? '');
$companyEmail = trim($data['company_email'] ?? '');
$companyAddress = trim($data['company_address'] ?? '');
$employerName = trim($data['employer_name'] ?? '');
$employerEmail = trim($data['employer_email'] ?? '');
$password = $data['password'] ?? '';

if (!$companyName || !$companyEmail || !$companyAddress || !$employerName || !$employerEmail || !$password) {
    send_json(['success' => false, 'message' => 'All fields are required'], 400);
}

// Check if employer email already exists
$checkStmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$checkStmt->bind_param("s", $employerEmail);
$checkStmt->execute();
if ($checkStmt->get_result()->num_rows > 0) {
    send_json(['success' => false, 'message' => 'Employer email already registered'], 409);
}

$conn->begin_transaction();

try {
    // 1. Create employer user first
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $userStmt = $conn->prepare("INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, 'EMPLOYER', 'ACTIVE')");
    $userStmt->bind_param("sss", $employerName, $employerEmail, $hashedPassword);
    $userStmt->execute();
    $employerId = $conn->insert_id;

    // 2. Create company with employer as creator
    $companyStmt = $conn->prepare("INSERT INTO companies (name, email, address, created_by, status) VALUES (?, ?, ?, ?, 'ACTIVE')");
    $companyStmt->bind_param("sssi", $companyName, $companyEmail, $companyAddress, $employerId);
    $companyStmt->execute();
    $companyId = $conn->insert_id;

    // 3. Update employer user with company_id
    $updateStmt = $conn->prepare("UPDATE users SET company_id = ? WHERE user_id = ?");
    $updateStmt->bind_param("ii", $companyId, $employerId);
    $updateStmt->execute();

    $conn->commit();
    send_json(['success' => true, 'message' => 'Company and employer registered successfully']);

} catch (Exception $e) {
    $conn->rollback();
    send_json(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()], 500);
}
?>