<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$data = json_decode(file_get_contents("php://input"), true);

session_start();

$response = [
    "applications" => 0,
    "reviews" => 0,
    "internships" => 0
];

try {
    if (!isset($_GET['student_id'])) {
        echo json_encode(["error" => "Missing student_id"]);
        exit;
    }

    $studentId = intval($_GET['student_id']);

    $stmt = $conn->prepare("SELECT COUNT(*) AS total FROM applications WHERE student_id = ?");
    $stmt->bind_param("i", $studentId);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $response["applications"] = $result['total'];

    $stmt = $conn->prepare("SELECT COUNT(*) AS total FROM reviews WHERE student_id = ?");
    $stmt->bind_param("i", $studentId);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $response["reviews"] = $result['total'];

    $result = $conn->query("SELECT COUNT(*) AS total FROM internships");
    $row = $result->fetch_assoc();
    $response["internships"] = $row['total'];

    echo json_encode($response);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

?>