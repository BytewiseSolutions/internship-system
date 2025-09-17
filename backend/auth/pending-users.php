<?php
require '../config.php';
require '../cors.php';
require '../utils.php';

$stmt = $pdo->prepare("SELECT id, name, email, contact, role, status FROM users WHERE status='PENDING'");
$stmt->execute();
$pending = $stmt->fetchAll();

echo json_encode($pending);
