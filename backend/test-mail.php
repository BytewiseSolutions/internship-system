<?php
require 'utils.php';

echo "Username: " . $_ENV['MAIL_USERNAME'] . PHP_EOL;
echo "Password: " . $_ENV['MAIL_PASSWORD'] . PHP_EOL;

if (sendMail("monamane.lebohang45@gmail.com", "Test Email", "Hello from Internship System!")) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email.";
}

?>