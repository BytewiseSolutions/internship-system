<?php
require 'cors.php';
require 'config.php';
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
    if ($row['status'] !== "ACTIVE" && $row['status'] !== "PENDING") {
        send_json(["message" => "Account not active. Current status: " . $row['status']], 403);
    }

    if (!password_verify($password, $row['password'])) {
        send_json(["message" => "Invalid password"], 401);
    }

    $token = generateToken($row['email'], $row['role']);

    $response = [
        "message" => "Login successful",
        "token" => $token,
        "role" => $row['role'],
        "email" => $row['email'],
        "id" => (int) $row['id'],
        "name" => $row['name']
    ];

    if ($row['role'] === 'COMPANY') {
        $stmt2 = $conn->prepare("SELECT id, name FROM companies WHERE user_id = ? LIMIT 1");
        $stmt2->bind_param("i", $row['id']);
        $stmt2->execute();
        $res2 = $stmt2->get_result();
        if ($r2 = $res2->fetch_assoc()) {
            $response['companyId'] = (int) $r2['id'];
            $response['companyName'] = $r2['name'];
        } else {
            $response['companyId'] = 0;
            $response['debug_user_id'] = $row['id'];
        }
        $stmt2->close();
    }
    
    $stmt->close();
    $conn->close();

    send_json($response);

} else {
    send_json(["message" => "User not found"], 404);
}
