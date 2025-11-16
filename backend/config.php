<?php
// Secure Database Configuration
// Step 1: Foundation Setup - Enhanced Security

// Simple development configuration
$servername = "localhost";
$username = "root";
$password = "password1";
$dbname = "internship_system";
$port = 3306;

// Simple database connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>