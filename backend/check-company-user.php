<?php
require 'cors.php';
require 'config.php';

$email = $_GET['email'] ?? 'thabo@gmail.com';

// Check user
$stmt = $conn->prepare("SELECT id, name, email, role, status FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo "User found:\n";
    echo json_encode($row, JSON_PRETTY_PRINT) . "\n\n";
    
    if ($row['role'] === 'COMPANY') {
        // Check company
        $stmt2 = $conn->prepare("SELECT id, name, email, industry, status FROM companies WHERE user_id = ?");
        $stmt2->bind_param("i", $row['id']);
        $stmt2->execute();
        $result2 = $stmt2->get_result();
        
        if ($row2 = $result2->fetch_assoc()) {
            echo "Company found:\n";
            echo json_encode($row2, JSON_PRETTY_PRINT);
        } else {
            echo "ERROR: No company record found for user_id: " . $row['id'] . "\n";
            echo "This user needs a company record created.\n";
        }
        $stmt2->close();
    }
} else {
    echo "User not found: $email";
}

$stmt->close();
$conn->close();
?>