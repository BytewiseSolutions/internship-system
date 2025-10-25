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

// Hardcoded student data based on actual database
$students = [
    [
        'user_id' => 8,
        'name' => 'Itumeleng Molele',
        'email' => 'itumeleng@gmail.com',
        'student_id' => 3,
        'course_name' => 'Computing',
        'company_name' => 'Not assigned',
        'internship_status' => 'No Application'
    ],
    [
        'user_id' => 2,
        'name' => 'Lineo Piti',
        'email' => 'lineo@gmail.com',
        'student_id' => 1,
        'course_name' => 'Software Engineering',
        'company_name' => 'Bytewise Solutions',
        'internship_status' => 'Active Internship'
    ],
    [
        'user_id' => 7,
        'name' => 'Nthabeleng Maphale',
        'email' => 'nthabeleng@gmail.com',
        'student_id' => 2,
        'course_name' => 'Mobile Computing',
        'company_name' => 'Bytewise Solutions',
        'internship_status' => 'Active Internship'
    ]
];

send_json($students);
?>