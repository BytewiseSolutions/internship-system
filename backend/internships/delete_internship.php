<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$id = $_GET['id'];

$stmt = $conn->prepare("DELETE FROM internships WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => $stmt->error]);
}

$stmt->close();
?>