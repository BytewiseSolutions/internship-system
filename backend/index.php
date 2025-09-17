<?php
require 'cors.php';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

switch ($path) {
    case '/register':
        require 'register.php';
        break;
    case '/login':
        require 'login.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found"]);
}
