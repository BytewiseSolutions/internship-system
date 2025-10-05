<?php
// Set CORS headers first
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove /backend prefix if present
if (strpos($path, '/backend/') === 0) {
    $path = substr($path, 8); 
}

if (file_exists(__DIR__ . $path)) {
    require __DIR__ . $path;
} else {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(["message" => "File not found: $path"]);
}
