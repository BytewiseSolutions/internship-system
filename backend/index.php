<?php
require 'cors.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

$dbExists = $conn->select_db('internshipdb');
if (!$dbExists) {
    require_once __DIR__ . '/setup.php';
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/backend#', '', $path);

switch ($path) {
    case '/register':
        require 'register.php';
        break;
    case '/login':
        require 'login.php';
        break;
    case '/auth/all_users.php':
        require 'auth/all_users.php';
        break;
    case '/internships/get_internships.php':
        require 'internships/get_internships.php';
        break;
    case '/applications/get_applications.php':
        require 'applications/get_applications.php';
        break;
    case '/applications/add_application.php':
        require 'applications/add_application.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found", "path" => $path]);
        break;
}
