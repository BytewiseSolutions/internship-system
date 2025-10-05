<?php
$servername = "localhost";
$username = "root";
$password = "password1";
$dbname = "internshipdb";

$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sqlCreateDB = "CREATE DATABASE IF NOT EXISTS `$dbname`";
if (!$conn->query($sqlCreateDB)) {
    die("Error creating database: " . $conn->error);
}
$conn->select_db($dbname);

$tableQueries = [

    "users" => "
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            role VARCHAR(20) NOT NULL,
            contact VARCHAR(50),
            password VARCHAR(255) NOT NULL,
            reset_token VARCHAR(255),
            status VARCHAR(20) DEFAULT 'PENDING'
        )",

    "companies" => "
        CREATE TABLE IF NOT EXISTS companies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            industry VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL,
            status ENUM('ACTIVE','INACTIVE','BLOCKED') DEFAULT 'ACTIVE',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )",

    "internships" => "
        CREATE TABLE IF NOT EXISTS internships (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            company_id INT NOT NULL,
            location VARCHAR(255) NOT NULL,
            postedDate DATE NOT NULL,
            deadline DATE NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'ACTIVE',
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
        )",

    "applications" => "
        CREATE TABLE IF NOT EXISTS applications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            internship_id INT NOT NULL,
            status VARCHAR(50) DEFAULT 'PENDING',
            cvPath VARCHAR(255),
            transcriptPath VARCHAR(255),
            applicationLetterPath VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE
        )",

    "reviews" => "
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
        )",

    "notifications" => "
        CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            message TEXT NOT NULL,
            is_read TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )"
];

foreach ($tableQueries as $table => $query) {
    if (!$conn->query($query)) {
        die("Error creating table $table: " . $conn->error);
    }
}

$users = [
    ['name' => 'Neo Sello', 'email' => 'neosello0320@gmail.com', 'role' => 'ADMIN', 'contact' => '59194870', 'password' => password_hash('Neo@1234', PASSWORD_DEFAULT), 'status' => 'ACTIVE'],
    ['name' => 'Company User', 'email' => 'companyuser@example.com', 'role' => 'COMPANY', 'contact' => '59194870', 'password' => password_hash('Company@123', PASSWORD_DEFAULT), 'status' => 'ACTIVE']
];

$stmt = $conn->prepare("INSERT INTO users (name,email,role,contact,password,status) VALUES (?,?,?,?,?,?)");
$companyUserId = null;
foreach ($users as $user) {
    $stmt->bind_param("ssssss", $user['name'], $user['email'], $user['role'], $user['contact'], $user['password'], $user['status']);
    $stmt->execute();
    if ($user['role'] === 'COMPANY') {
        $companyUserId = $conn->insert_id;
    }
}
$stmt->close();

$companies = [
    ['user_id' => $companyUserId, 'name' => 'Example Company', 'email' => 'companyuser@example.com', 'industry' => 'Tech', 'created_at' => date('Y-m-d'), 'status' => 'ACTIVE']
];

$stmtC = $conn->prepare("INSERT INTO companies (user_id,name,email,industry,created_at,status) VALUES (?,?,?,?,?,?)");
foreach ($companies as $company) {
    $stmtC->bind_param("isssss", $company['user_id'], $company['name'], $company['email'], $company['industry'], $company['created_at'], $company['status']);
    $stmtC->execute();
}
$stmtC->close();

echo "Database setup complete: all tables created, only Admins and Company inserted.";
$conn->close();
?>