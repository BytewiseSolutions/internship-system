<?php
require 'cors.php';
require 'config.php';

// Test if company user exists and has company record
$email = 'companyuser@example.com';

$stmt = $conn->prepare("SELECT id, name, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo "User found: " . json_encode($row) . "\n";
    
    $stmt2 = $conn->prepare("SELECT id, name FROM companies WHERE user_id = ?");
    $stmt2->bind_param("i", $row['id']);
    $stmt2->execute();
    $result2 = $stmt2->get_result();
    
    if ($row2 = $result2->fetch_assoc()) {
        echo "Company found: " . json_encode($row2);
    } else {
        echo "No company record found for user ID: " . $row['id'];
    }
    $stmt2->close();
} else {
    echo "User not found";
}

$stmt->close();
$conn->close();
?>