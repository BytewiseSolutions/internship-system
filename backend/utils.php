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

// Enhanced JWT Token Functions
function generateToken($email, $role, $userId = null) {
    $secret = $_ENV['JWT_SECRET'] ?? 'default-secret-change-this';
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    
    $payload = [
        "email" => $email,
        "role" => $role,
        "user_id" => $userId,
        "iat" => time(),
        "exp" => time() + (int)($_ENV['SESSION_TIMEOUT'] ?? 86400),
        "jti" => bin2hex(random_bytes(16)) // Unique token ID
    ];
    
    $headerEncoded = base64url_encode($header);
    $payloadEncoded = base64url_encode(json_encode($payload));
    
    $signature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, $secret, true);
    $signatureEncoded = base64url_encode($signature);
    
    return $headerEncoded . "." . $payloadEncoded . "." . $signatureEncoded;
}

function decodeToken($token) {
    if (!$token) return [];
    
    $parts = explode('.', $token);
    if (count($parts) !== 3) return [];
    
    $secret = $_ENV['JWT_SECRET'] ?? 'default-secret-change-this';
    $header = base64url_decode($parts[0]);
    $payload = base64url_decode($parts[1]);
    $signature = base64url_decode($parts[2]);
    
    // Verify signature
    $expectedSignature = hash_hmac('sha256', $parts[0] . "." . $parts[1], $secret, true);
    if (!hash_equals($signature, $expectedSignature)) {
        return [];
    }
    
    $payloadData = json_decode($payload, true);
    if (!is_array($payloadData)) return [];
    
    // Check expiration
    if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
        return [];
    }
    
    return $payloadData;
}

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
}

// Token validation middleware
function validateToken($requiredRole = null) {
    $headers = getallheaders();
    $token = null;
    
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }
    }
    
    if (!$token) {
        send_json(['error' => 'No token provided'], 401);
    }
    
    $payload = decodeToken($token);
    if (empty($payload)) {
        send_json(['error' => 'Invalid or expired token'], 401);
    }
    
    if ($requiredRole && $payload['role'] !== $requiredRole) {
        send_json(['error' => 'Insufficient permissions'], 403);
    }
    
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