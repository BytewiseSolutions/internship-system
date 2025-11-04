<?php
$host = 'localhost';
$username = 'root';
$password = 'password1';

try {
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connected to MySQL server successfully.\n";

    $sql = file_get_contents(__DIR__ . '/db/create_database.sql');

    $statements = array_filter(array_map('trim', explode(';', $sql)));

    foreach ($statements as $statement) {
        if (!empty($statement)) {
            $pdo->exec($statement);
        }
    }

    echo "Database and tables created successfully!\n";
    echo "Default admin login: admin@system.com / password\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>