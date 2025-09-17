<?php
require 'config.php';
require 'utils.php';
require 'cors.php';

$result = $conn->query("SELECT id, name, email, role, contact, status FROM users WHERE status='PENDING'");

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

send_json($users);
$conn->close();
?>