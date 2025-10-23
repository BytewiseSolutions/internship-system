<?php
require_once './config.php';

$result = $conn->query("SELECT user_id, name, email, role, school_id FROM users WHERE role = 'SCHOOL_ADMIN'");

echo "School Admin Users:\n";
while ($row = $result->fetch_assoc()) {
    echo "ID: " . $row['user_id'] . ", Name: " . $row['name'] . ", Email: " . $row['email'] . ", School ID: " . ($row['school_id'] ?? 'NULL') . "\n";
}

$conn->close();
?>