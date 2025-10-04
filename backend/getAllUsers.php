<?php
require 'cors.php';
require 'config.php';
require 'utils.php';

$result = $conn->query("SELECT id, name, email, role, contact, status FROM users");

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

send_json($users);
$conn->close();
?>