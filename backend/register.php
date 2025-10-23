<?php
require_once './cors.php';
require_once './config.php';
require_once './utils.php';

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$school_id = $data['school_id'];
$course_id = $data['course_id'];

$conn->begin_transaction();

try {
    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'STUDENT')");
    $stmt->bind_param("sss", $name, $email, $password);
    $stmt->execute();
    $user_id = $conn->insert_id;

    // Insert student
    $stmt = $conn->prepare("INSERT INTO students (user_id, school_id, course_id) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $user_id, $school_id, $course_id);
    $stmt->execute();

    $conn->commit();
    send_json(['success' => true, 'message' => 'Student registered successfully']);

} catch (Exception $e) {
    $conn->rollback();
    send_json(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()], 500);
}

$conn->close();
?>