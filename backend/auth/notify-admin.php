<?php
require '../cors.php';
require '../config.php';
require '../utils.php';
require_once __DIR__ . "/notify_admin.php";

$data = json_decode(file_get_contents("php://input"), true);
$role = $data['role'] ?? 'Unknown';

$result = notifyAdmins($role);
send_json($result);
?>