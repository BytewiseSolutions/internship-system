<?php
$servername = "localhost";
$username = "root";
$password = "password1";
$dbname = "internship_system";
$port = 3306;

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>