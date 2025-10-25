<?php
require_once "config.php";

echo "=== STUDENTS DEBUG ===\n\n";

// Check students table
echo "Students table:\n";
$result = $conn->query("SELECT * FROM students");
while ($row = $result->fetch_assoc()) {
    print_r($row);
}

echo "\n=== APPLICATIONS DEBUG ===\n\n";

// Check applications table
echo "Applications table:\n";
$result = $conn->query("SELECT * FROM applications");
while ($row = $result->fetch_assoc()) {
    print_r($row);
}

echo "\n=== USERS DEBUG ===\n\n";

// Check users table for students
echo "Student users:\n";
$result = $conn->query("SELECT * FROM users WHERE role = 'student'");
while ($row = $result->fetch_assoc()) {
    print_r($row);
}

echo "\n=== COURSES DEBUG ===\n\n";

// Check courses table
echo "Courses table:\n";
$result = $conn->query("SELECT * FROM courses");
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>