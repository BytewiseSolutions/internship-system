<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

$result = $conn->query("SELECT * FROM companies ORDER BY created_at DESC");

$companies = [];
while ($row = $result->fetch_assoc()) {
    $companies[] = [
        "id" => (int) $row['company_id'],
        "name" => $row['name'],
        "email" => $row['email'],
        "address" => $row['address'],
        "createdAt" => $row['created_at'],
        "status" => $row['status']
    ];
}

send_json($companies);
