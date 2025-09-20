<?php
$servername = "localhost";
$username = "root";
$password = "password1";
$dbname = "internshipdb";

$conn = new mysqli($servername, $username, $password);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

try {
    $conn->select_db($dbname);
} catch (mysqli_sql_exception $e) {
    $sqlCreateDB = "CREATE DATABASE `$dbname`";
    if (!$conn->query($sqlCreateDB)) {
        die("Error creating database: " . $conn->error);
    }
    $conn->select_db($dbname);
}

$tablesExist = $conn->query("SHOW TABLES LIKE 'users'");
if ($tablesExist->num_rows == 0) {
    require_once __DIR__ . '/setup.php';
}
?>