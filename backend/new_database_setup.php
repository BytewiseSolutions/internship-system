<?php
$servername = "localhost";
$username = "root";
$password = "password1";
$dbname = "internshipdb_v2";

$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Drop existing database and create new one
$conn->query("DROP DATABASE IF EXISTS `$dbname`");
$sqlCreateDB = "CREATE DATABASE `$dbname`";
if (!$conn->query($sqlCreateDB)) {
    die("Error creating database: " . $conn->error);
}
$conn->select_db($dbname);

$tableQueries = [
    "users_temp" => "
        CREATE TABLE users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('SYSTEM_ADMIN','SCHOOL_ADMIN','LECTURER','STUDENT','COMPANY') NOT NULL,
            status VARCHAR(20) DEFAULT 'ACTIVE',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )",

    "schools" => "
        CREATE TABLE schools (
            school_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            address VARCHAR(255),
            created_by INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
        )",

    "courses" => "
        CREATE TABLE courses (
            course_id INT AUTO_INCREMENT PRIMARY KEY,
            school_id INT NOT NULL,
            course_name VARCHAR(100) NOT NULL,
            FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE
        )",

    "companies" => "
        CREATE TABLE companies (
            company_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            email VARCHAR(100) NOT NULL,
            address VARCHAR(255),
            created_by INT NOT NULL,
            status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
        )",

    "students" => "
        CREATE TABLE students (
            student_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            school_id INT NOT NULL,
            course_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
        )",

    "lecturers" => "
        CREATE TABLE lecturers (
            lecturer_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            school_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE
        )",

    "internships" => "
        CREATE TABLE internships (
            internship_id INT AUTO_INCREMENT PRIMARY KEY,
            company_id INT NOT NULL,
            title VARCHAR(150) NOT NULL,
            description TEXT,
            location VARCHAR(255),
            deadline DATE,
            status ENUM('OPEN','CLOSED') DEFAULT 'OPEN',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
        )",

    "applications" => "
        CREATE TABLE applications (
            application_id INT AUTO_INCREMENT PRIMARY KEY,
            internship_id INT NOT NULL,
            student_id INT NOT NULL,
            status ENUM('PENDING','ACCEPTED','REJECTED') DEFAULT 'PENDING',
            lecturer_id INT NULL,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (internship_id) REFERENCES internships(internship_id) ON DELETE CASCADE,
            FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
            FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id) ON DELETE SET NULL
        )",

    "logbook" => "
        CREATE TABLE logbook (
            logbook_id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            week_number INT NOT NULL,
            week_ending DATE NOT NULL,
            activities_completed TEXT NOT NULL,
            skills_learned TEXT NOT NULL,
            challenges_faced TEXT NOT NULL,
            supervisor_feedback TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
        )",

    "users_update" => "
        ALTER TABLE users ADD COLUMN school_id INT NULL,
        ADD COLUMN company_id INT NULL,
        ADD FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE SET NULL,
        ADD FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE SET NULL"
];

foreach ($tableQueries as $table => $query) {
    if (!$conn->query($query)) {
        die("Error creating table $table: " . $conn->error);
    }
}

// Insert default data
$systemAdmin = [
    'name' => 'System Administrator',
    'email' => 'admin@system.com',
    'password' => password_hash('Admin@123', PASSWORD_DEFAULT),
    'role' => 'SYSTEM_ADMIN'
];

$stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $systemAdmin['name'], $systemAdmin['email'], $systemAdmin['password'], $systemAdmin['role']);
$stmt->execute();
$systemAdminId = $conn->insert_id;

// Insert sample school
$stmt = $conn->prepare("INSERT INTO schools (name, address, created_by) VALUES (?, ?, ?)");
$schoolName = "National University of Lesotho";
$schoolAddress = "Roma, Lesotho";
$stmt->bind_param("ssi", $schoolName, $schoolAddress, $systemAdminId);
$stmt->execute();
$schoolId = $conn->insert_id;

// Insert sample courses
$courses = ['Computer Science', 'Information Technology', 'Business Administration'];
$stmt = $conn->prepare("INSERT INTO courses (school_id, course_name) VALUES (?, ?)");
foreach ($courses as $course) {
    $stmt->bind_param("is", $schoolId, $course);
    $stmt->execute();
}

echo "New database structure created successfully!\n";
echo "System Admin: admin@system.com / Admin@123\n";
$conn->close();
?>