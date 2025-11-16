<?php
// Security Configuration for Internship Management System
// Step 1: Foundation Setup - Security Hardening

class SecurityConfig {
    
    // Security headers
    public static function setSecurityHeaders() {
        $isProduction = ($_ENV['APP_ENV'] ?? 'development') === 'production';
        
        // Basic security headers (always enabled)
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');
        
        // Production-only security headers
        if ($isProduction) {
            header('Referrer-Policy: strict-origin-when-cross-origin');
            header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;");
            header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
            
            // HTTPS enforcement
            if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
                if (isset($_SERVER['HTTP_HOST']) && isset($_SERVER['REQUEST_URI'])) {
                    $redirectURL = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
                    header("Location: $redirectURL", true, 301);
                    exit();
                }
            }
        } else {
            // Development-friendly headers
            header('Referrer-Policy: no-referrer-when-downgrade');
        }
    }
    
    // Input validation and sanitization
    public static function validateInput($input, $type = 'string', $maxLength = 255) {
        if (empty($input)) {
            return false;
        }
        
        // Remove null bytes
        $input = str_replace(chr(0), '', $input);
        
        switch ($type) {
            case 'email':
                return filter_var($input, FILTER_VALIDATE_EMAIL) !== false;
            case 'int':
                return filter_var($input, FILTER_VALIDATE_INT) !== false;
            case 'string':
                $input = trim($input);
                return strlen($input) <= $maxLength && strlen($input) > 0;
            case 'text':
                $input = trim($input);
                return strlen($input) <= $maxLength;
            default:
                return false;
        }
    }
    
    // SQL injection prevention
    public static function sanitizeForSQL($input) {
        return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
    }
    
    // Rate limiting
    public static function checkRateLimit($identifier, $maxAttempts = 5, $timeWindow = 300) {
        $rateLimitFile = __DIR__ . '/rate_limits.json';
        $rateLimits = [];
        
        if (file_exists($rateLimitFile)) {
            $rateLimits = json_decode(file_get_contents($rateLimitFile), true) ?: [];
        }
        
        $currentTime = time();
        $key = md5($identifier);
        
        // Clean old entries
        foreach ($rateLimits as $k => $data) {
            if ($currentTime - $data['first_attempt'] > $timeWindow) {
                unset($rateLimits[$k]);
            }
        }
        
        if (!isset($rateLimits[$key])) {
            $rateLimits[$key] = [
                'attempts' => 1,
                'first_attempt' => $currentTime
            ];
        } else {
            $rateLimits[$key]['attempts']++;
        }
        
        file_put_contents($rateLimitFile, json_encode($rateLimits));
        
        return $rateLimits[$key]['attempts'] <= $maxAttempts;
    }
    
    // File upload security
    public static function validateFileUpload($file, $allowedTypes = ['pdf', 'doc', 'docx'], $maxSize = 5242880) {
        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return ['valid' => false, 'error' => 'Invalid file upload'];
        }
        
        if ($file['size'] > $maxSize) {
            return ['valid' => false, 'error' => 'File too large'];
        }
        
        $fileInfo = pathinfo($file['name']);
        $extension = strtolower($fileInfo['extension']);
        
        if (!in_array($extension, $allowedTypes)) {
            return ['valid' => false, 'error' => 'File type not allowed'];
        }
        
        // Check MIME type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        $allowedMimes = [
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!in_array($mimeType, $allowedMimes)) {
            return ['valid' => false, 'error' => 'Invalid file type'];
        }
        
        return ['valid' => true, 'extension' => $extension];
    }
    
    // Generate secure filename
    public static function generateSecureFilename($originalName) {
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        return uniqid() . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
    }
}
?>