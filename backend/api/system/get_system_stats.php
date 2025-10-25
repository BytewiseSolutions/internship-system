<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config.php';
require_once '../../utils.php';

// Get schools count
$schoolsResult = $conn->query("SELECT COUNT(*) as count FROM schools");
$schoolsCount = $schoolsResult->fetch_assoc()['count'];

// Get companies count
$companiesResult = $conn->query("SELECT COUNT(*) as count FROM companies");
$companiesCount = $companiesResult->fetch_assoc()['count'];

// Get users count
$usersResult = $conn->query("SELECT COUNT(*) as count FROM users");
$usersCount = $usersResult->fetch_assoc()['count'];

// Get applications count
$applicationsResult = $conn->query("SELECT COUNT(*) as count FROM applications");
$applicationsCount = $applicationsResult->fetch_assoc()['count'];

$stats = [
    'schools' => (int)$schoolsCount,
    'companies' => (int)$companiesCount,
    'users' => (int)$usersCount,
    'applications' => (int)$applicationsCount
];

send_json($stats);
?>