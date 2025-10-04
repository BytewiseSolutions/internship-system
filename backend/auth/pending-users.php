<?php
require '../cors.php';
require '../config.php';
require '../utils.php';

$stmt = $conn->prepare("SELECT id, name, email, contact, role, status FROM users WHERE status='PENDING'");
$stmt->execute();
$result = $stmt->get_result();
$pending = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($pending);
$stmt->close();
$conn->close();
