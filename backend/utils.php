<?php
require __DIR__ . '/../phpmailer/src/PHPMailer.php';
require __DIR__ . '/../phpmailer/src/SMTP.php';
require __DIR__ . '/../phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function loadEnv($path)
{
    if (!file_exists($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0)
            continue;
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        $_ENV[$name] = $value;
        putenv("$name=$value");
    }
}

loadEnv(__DIR__ . '/.env');

function send_json($data, $status = 200)
{
    http_response_code($status);
    header("Content-Type: application/json");
    echo json_encode($data);
    exit();
}

function generateToken($email, $role)
{
    $payload = [
        "email" => $email,
        "role" => $role,
        "iat" => time(),
        "exp" => time() + (60 * 60 * 24)
    ];
    return base64_encode(json_encode($payload));
}
function decodeToken($token)
{
    if (!$token)
        return [];
    $decoded = base64_decode($token, true);
    if (!$decoded)
        return [];
    $payload = json_decode($decoded, true);
    if (!is_array($payload))
        return [];
    return $payload;
}
function sendMail($to, $subject, $body)
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = $_ENV['MAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['MAIL_USERNAME'];
        $mail->Password = $_ENV['MAIL_PASSWORD'];
        $mail->SMTPSecure = 'tls';
        $mail->Port = (int) $_ENV['MAIL_PORT'];

        $mail->SMTPDebug = 2;
        $mail->Debugoutput = 'error_log';

        $mail->setFrom($_ENV['MAIL_FROM'], $_ENV['MAIL_FROM_NAME']);
        $mail->addAddress($to);

        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $body;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: " . $mail->ErrorInfo);
        return false;
    }
}