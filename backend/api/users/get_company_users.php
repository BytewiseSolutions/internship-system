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

$sql = "SELECT u.user_id, u.name, u.email, u.company_id, u.status, c.name as company_name 
        FROM users u 
        LEFT JOIN companies c ON u.company_id = c.company_id 
        WHERE u.role IN ('COMPANY', 'EMPLOYER')";

$result = $conn->query($sql);
$users = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

send_json($users);
?>