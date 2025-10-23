<?php
require 'cors.php';
require 'config.php';
require 'utils.php';

$result = $conn->query("SELECT user_id as id, name, email, role, '' as contact, status FROM users");

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

send_json($users);
$conn->close();
?>