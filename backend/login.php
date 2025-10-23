<?php
require_once './cors.php';
require_once './utils.php';
require_once './config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['email'], $data['password'])) {
    send_json(["message" => "Email and password required"], 400);
}

$email = $data['email'];
$password = $data['password'];

$stmt = $conn->prepare("SELECT user_id, name, email, role, password, status, school_id FROM users WHERE email=?");
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

    $response = [
        "message" => "Login successful",
        "token" => $token,
        "role" => $row['role'],
        "email" => $row['email'],
        "id" => (int) $row['user_id'],
        "name" => $row['name']
    ];

    // Get additional info based on role
    if ($row['role'] === 'STUDENT') {
        $stmt2 = $conn->prepare("SELECT s.student_id, sc.name as school_name, c.course_name 
                                FROM students s 
                                JOIN schools sc ON s.school_id = sc.school_id 
                                JOIN courses c ON s.course_id = c.course_id 
                                WHERE s.user_id = ?");
        $stmt2->bind_param("i", $row['user_id']);
        $stmt2->execute();
        $res2 = $stmt2->get_result();
        if ($r2 = $res2->fetch_assoc()) {
            $response['student_id'] = (int) $r2['student_id'];
            $response['school_name'] = $r2['school_name'];
            $response['course_name'] = $r2['course_name'];
        }
        $stmt2->close();
    } elseif ($row['role'] === 'SCHOOL_ADMIN') {
        if ($row['school_id']) {
            $response['school_id'] = (int) $row['school_id'];
        }
        error_log('SCHOOL_ADMIN login - school_id: ' . ($row['school_id'] ?? 'NULL'));
    }

    $stmt->close();
    $conn->close();
    send_json($response);

} else {
    send_json(["message" => "User not found"], 404);
}
?>