<?php
$servername = "localhost";
$username = "root";
$password = "password1";
$dbname = "internshipdb";

// Connect to MySQL
$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if not exists
$sqlCreateDB = "CREATE DATABASE IF NOT EXISTS $dbname";
if (!$conn->query($sqlCreateDB)) {
    die("Error creating database: " . $conn->error);
}
$conn->select_db($dbname);

// ===================== TABLES =====================

// Users table
$sqlCreateUsersTable = "
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    contact VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING'
)";
if (!$conn->query($sqlCreateUsersTable))
    die("Error creating users table: " . $conn->error);

// Companies table
$sqlCreateCompaniesTable = "
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL,
    status ENUM('Active','Inactive','Blocked') DEFAULT 'Active'
)";
if (!$conn->query($sqlCreateCompaniesTable))
    die("Error creating companies table: " . $conn->error);

// Internships table
$sqlCreateInternshipsTable = "
CREATE TABLE IF NOT EXISTS internships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company_id INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    postedDate DATE NOT NULL,
    deadline DATE NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
)";
if (!$conn->query($sqlCreateInternshipsTable))
    die("Error creating internships table: " . $conn->error);

// Applications table
$sqlCreateApplicationsTable = "
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    internship_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    cvPath VARCHAR(255),
    transcriptPath VARCHAR(255),
    applicationLetterPath VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE
)";
if (!$conn->query($sqlCreateApplicationsTable))
    die("Error creating applications table: " . $conn->error);

// Reviews table
$sqlCreateReviewsTable = "
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    internship_id INT NOT NULL,
    company_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    employer_reply TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
)";
if (!$conn->query($sqlCreateReviewsTable))
    die("Error creating reviews table: " . $conn->error);

// ===================== SEED DATA =====================

// Companies
$companies = [
    [
        'name' => 'Example Company',
        'email' => 'company@example.com',
        'industry' => 'Tech',
        'created_at' => date('Y-m-d'),
        'status' => 'Active'
    ]
];

$stmtCompany = $conn->prepare("INSERT INTO companies (name, email, industry, created_at, status) VALUES (?, ?, ?, ?, ?)");
foreach ($companies as $company) {
    $stmtCompany->bind_param("sssss", $company['name'], $company['email'], $company['industry'], $company['created_at'], $company['status']);
    $stmtCompany->execute();
}
$stmtCompany->close();

// Users
$users = [
    [
        'name' => 'Lebohang Monamane',
        'email' => 'monamane.lebohang45@gmail.com',
        'role' => 'ADMIN',
        'contact' => '59181664',
        'password' => password_hash('Lebo@123', PASSWORD_DEFAULT),
        'reset_token' => null,
        'status' => 'ACTIVE'
    ],
    [
        'name' => 'qenehelo Khophoche',
        'email' => 'qenehelokhophoche@gmail.com',
        'role' => 'STUDENT',
        'contact' => '57510582',
        'password' => password_hash('Canylee@123', PASSWORD_DEFAULT),
        'reset_token' => null,
        'status' => 'ACTIVE'
    ],
    [
        'name' => 'Company User',
        'email' => 'company@example.com',
        'role' => 'COMPANY',
        'contact' => '59194870',
        'password' => password_hash('Company@123', PASSWORD_DEFAULT),
        'reset_token' => null,
        'status' => 'ACTIVE'
    ]
];

$stmt = $conn->prepare("INSERT INTO users (name, email, role, contact, password, reset_token, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
foreach ($users as $user) {
    $stmt->bind_param("sssssss", $user['name'], $user['email'], $user['role'], $user['contact'], $user['password'], $user['reset_token'], $user['status']);
    $stmt->execute();
}
$stmt->close();

echo "Database, tables, users, and companies setup complete.";

$conn->close();
?>