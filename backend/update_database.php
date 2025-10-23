<?php
require_once 'config.php';

// Create logbook table
$logbookQuery = "
    CREATE TABLE IF NOT EXISTS logbook (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        week_number INT NOT NULL,
        week_ending DATE NOT NULL,
        activities_completed TEXT NOT NULL,
        skills_learned TEXT NOT NULL,
        challenges_faced TEXT NOT NULL,
        supervisor_feedback TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    )";

if ($conn->query($logbookQuery)) {
    echo "Logbook table created successfully\n";
} else {
    echo "Error creating logbook table: " . $conn->error . "\n";
}

// Add a default lecturer user
$lecturerExists = $conn->query("SELECT id FROM users WHERE role = 'LECTURER' LIMIT 1");
if ($lecturerExists->num_rows == 0) {
    $stmt = $conn->prepare("INSERT INTO users (name, email, role, contact, password, status) VALUES (?, ?, ?, ?, ?, ?)");
    $name = "Dr. John Smith";
    $email = "lecturer@example.com";
    $role = "LECTURER";
    $contact = "59194871";
    $password = password_hash('Lecturer@123', PASSWORD_DEFAULT);
    $status = "ACTIVE";
    
    $stmt->bind_param("ssssss", $name, $email, $role, $contact, $password, $status);
    
    if ($stmt->execute()) {
        echo "Default lecturer user created successfully\n";
    } else {
        echo "Error creating lecturer user: " . $stmt->error . "\n";
    }
    $stmt->close();
}

$conn->close();
echo "Database update completed\n";
?>