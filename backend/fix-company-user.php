<?php
require 'cors.php';
require 'config.php';

$email = $_GET['email'] ?? 'thabo@gmail.com';

// Get user
$stmt = $conn->prepare("SELECT id, name, email FROM users WHERE email = ? AND role = 'COMPANY'");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $userId = $row['id'];
    
    // Check if company already exists
    $checkStmt = $conn->prepare("SELECT id FROM companies WHERE user_id = ?");
    $checkStmt->bind_param("i", $userId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows > 0) {
        echo "Company already exists for this user.\n";
        $existing = $checkResult->fetch_assoc();
        echo "Company ID: " . $existing['id'];
    } else {
        // Create company record
        $companyName = $row['name'] . " Company";
        $companyEmail = $row['email'];
        $industry = "Technology";
        $status = "ACTIVE";
        $createdAt = date('Y-m-d');
        
        $insertStmt = $conn->prepare("INSERT INTO companies (user_id, name, email, industry, created_at, status) VALUES (?, ?, ?, ?, ?, ?)");
        $insertStmt->bind_param("isssss", $userId, $companyName, $companyEmail, $industry, $createdAt, $status);
        
        if ($insertStmt->execute()) {
            echo "Company created successfully!\n";
            echo "Company ID: " . $insertStmt->insert_id . "\n";
            echo "User ID: " . $userId . "\n";
            echo "Company Name: " . $companyName;
        } else {
            echo "Error creating company: " . $insertStmt->error;
        }
        $insertStmt->close();
    }
    $checkStmt->close();
} else {
    echo "User not found or not a COMPANY user: $email";
}

$stmt->close();
$conn->close();
?>