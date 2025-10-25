<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config.php';
require_once '../../utils.php';

$sql = "SELECT u.user_id, u.name, u.email, u.school_id, u.status, s.name as school_name 
        FROM users u 
        LEFT JOIN schools s ON u.school_id = s.school_id 
        WHERE u.role = 'SCHOOL_ADMIN'";

$result = $conn->query($sql);
$admins = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $admins[] = $row;
    }
}

send_json($admins);
?>