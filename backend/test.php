<?php
require 'cors.php';

echo json_encode([
    'status' => 'success',
    'message' => 'Backend server is running',
    'timestamp' => date('Y-m-d H:i:s'),
    'port' => $_SERVER['SERVER_PORT'] ?? 'unknown'
]);
?>