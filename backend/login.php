<?php
require 'config.php';
require 'cors.php';
require 'utils.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['email'], $data['password'])) {
    send_json(["message" => "Email and password required"], 400);
}

$email = $data['email'];
$password = $data['password'];

$stmt = $conn->prepare("SELECT id, name, email, role, password, status FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if ($row['status'] !== "ACTIVE") {
        send_json(["message" => "Account not active. Current status: " . $row['status']], 403);
    }

    if (!password_verify($password, $row['password'])) {
        send_json(["message" => "Invalid password"], 401);
    }

    $token = generateToken($row['email'], $row['role']);

    $companyId = null;
    if ($row['role'] === 'COMPANY') {
        $stmt2 = $conn->prepare("SELECT id FROM companies WHERE email = ? LIMIT 1");
        if ($stmt2) {
            $stmt2->bind_param("s", $row['email']);
            $stmt2->execute();
            $res2 = $stmt2->get_result();
            if ($r2 = $res2->fetch_assoc()) {
                $companyId = (int) $r2['id'];
            }
            $stmt2->close();
        }
    }

    send_json([
        "message" => "Login successful",
        "token" => $token,
        "role" => $row['role'],
        "email" => $row['email'],
        "id" => (int) $row['id'],
        "name" => $row['name'],
        "company_id" => $companyId
    ]);
} else {
    send_json(["message" => "User not found"], 404);
}
