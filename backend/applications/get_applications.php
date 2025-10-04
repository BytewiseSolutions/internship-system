<?php
require_once '../cors.php';
require_once '../utils.php';
require './config.php';

$student_id = isset($_GET['student_id']) ? intval($_GET['student_id']) : null;

try {
    if ($student_id) {
        $stmt = $conn->prepare("SELECT * FROM applications WHERE student_id = ?");
        $stmt->bind_param("i", $student_id);
    } else {
        $stmt = $conn->prepare("SELECT * FROM applications");
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $applications = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($applications);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

?>