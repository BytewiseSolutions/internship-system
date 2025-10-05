<?php
require '../cors.php';

send_json([
    'message' => 'Auth API is running',
    'endpoints' => [
        'POST /auth/register-company-user.php',
        'POST /auth/register-company-details.php',
        'GET /auth/all_users.php',
        'GET /auth/pending-users.php'
    ],
    'timestamp' => date('Y-m-d H:i:s')
]);
?>