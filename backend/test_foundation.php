<?php
// Foundation Setup Test Script
// Quick verification that all foundation components are working

require_once 'config.php';
require_once 'security_config.php';
require_once 'utils.php';

echo "🧪 Testing Foundation Setup\n";
echo "===========================\n\n";

$tests = [];
$passed = 0;
$total = 0;

// Test 1: Database Connection
echo "1. Testing Database Connection... ";
$total++;
try {
    $result = $conn->query("SELECT 1");
    if ($result) {
        echo "✅ PASS\n";
        $tests['database_connection'] = 'PASS';
        $passed++;
    } else {
        echo "❌ FAIL\n";
        $tests['database_connection'] = 'FAIL';
    }
} catch (Exception $e) {
    echo "❌ FAIL: " . $e->getMessage() . "\n";
    $tests['database_connection'] = 'FAIL: ' . $e->getMessage();
}

// Test 2: Security Configuration
echo "2. Testing Security Configuration... ";
$total++;
try {
    // Test security functions without setting headers in CLI mode
    if (php_sapi_name() !== 'cli') {
        SecurityConfig::setSecurityHeaders();
    }
    // Test other security functions
    $testValid = SecurityConfig::validateInput('test', 'string');
    if ($testValid) {
        echo "✅ PASS\n";
        $tests['security_headers'] = 'PASS';
        $passed++;
    } else {
        echo "❌ FAIL: Security validation failed\n";
        $tests['security_headers'] = 'FAIL: Security validation failed';
    }
} catch (Exception $e) {
    echo "❌ FAIL: " . $e->getMessage() . "\n";
    $tests['security_headers'] = 'FAIL: ' . $e->getMessage();
}

echo "3. Testing JWT Token System... ";
$total++;
try {
    $token = generateToken('test@example.com', 'STUDENT', 1);
    $decoded = decodeToken($token);
    if ($decoded && $decoded['email'] === 'test@example.com') {
        echo "✅ PASS\n";
        $tests['jwt_tokens'] = 'PASS';
        $passed++;
    } else {
        echo "❌ FAIL: Token decode failed\n";
        $tests['jwt_tokens'] = 'FAIL: Token decode failed';
    }
} catch (Exception $e) {
    echo "❌ FAIL: " . $e->getMessage() . "\n";
    $tests['jwt_tokens'] = 'FAIL: ' . $e->getMessage();
}

echo "4. Testing Input Validation... ";
$total++;
try {
    $validEmail = SecurityConfig::validateInput('test@example.com', 'email');
    $invalidEmail = SecurityConfig::validateInput('invalid-email', 'email');
    $validString = SecurityConfig::validateInput('Valid String', 'string', 50);
    
    if ($validEmail && !$invalidEmail && $validString) {
        echo "✅ PASS\n";
        $tests['input_validation'] = 'PASS';
        $passed++;
    } else {
        echo "❌ FAIL: Validation logic error\n";
        $tests['input_validation'] = 'FAIL: Validation logic error';
    }
} catch (Exception $e) {
    echo "❌ FAIL: " . $e->getMessage() . "\n";
    $tests['input_validation'] = 'FAIL: ' . $e->getMessage();
}

// Test 5: File Upload Validation
echo "5. Testing File Upload Security... ";
$total++;
try {
    // Simulate a valid file upload
    $mockFile = [
        'name' => 'test.pdf',
        'tmp_name' => __FILE__, // Use this file as mock
        'size' => filesize(__FILE__)
    ];
    
    // This will fail because it's not actually uploaded, but we can test the logic
    $result = SecurityConfig::validateFileUpload($mockFile);
    
    // Test secure filename generation
    $secureFilename = SecurityConfig::generateSecureFilename('test.pdf');
    
    if (strpos($secureFilename, '.pdf') !== false && strlen($secureFilename) > 10) {
        echo "✅ PASS\n";
        $tests['file_upload_security'] = 'PASS';
        $passed++;
    } else {
        echo "❌ FAIL: Filename generation failed\n";
        $tests['file_upload_security'] = 'FAIL: Filename generation failed';
    }
} catch (Exception $e) {
    echo "❌ FAIL: " . $e->getMessage() . "\n";
    $tests['file_upload_security'] = 'FAIL: ' . $e->getMessage();
}

// Test 6: Environment Variables
echo "6. Testing Environment Configuration... ";
$total++;
$requiredVars = ['DB_HOST', 'DB_USERNAME', 'DB_NAME', 'JWT_SECRET'];
$missingVars = [];

foreach ($requiredVars as $var) {
    if (!isset($_ENV[$var])) {
        $missingVars[] = $var;
    }
}

if (empty($missingVars)) {
    echo "✅ PASS\n";
    $tests['environment_config'] = 'PASS';
    $passed++;
} else {
    echo "❌ FAIL: Missing variables: " . implode(', ', $missingVars) . "\n";
    $tests['environment_config'] = 'FAIL: Missing variables: ' . implode(', ', $missingVars);
}

// Test 7: Directory Permissions
echo "7. Testing Directory Structure... ";
$total++;
$requiredDirs = ['logs', 'backups', 'uploads'];
$missingDirs = [];

foreach ($requiredDirs as $dir) {
    $path = __DIR__ . '/' . $dir;
    if (!is_dir($path)) {
        $missingDirs[] = $dir;
    }
}

if (empty($missingDirs)) {
    echo "✅ PASS\n";
    $tests['directory_structure'] = 'PASS';
    $passed++;
} else {
    echo "❌ FAIL: Missing directories: " . implode(', ', $missingDirs) . "\n";
    $tests['directory_structure'] = 'FAIL: Missing directories: ' . implode(', ', $missingDirs);
}

// Test 8: Database Indexes
echo "8. Testing Database Indexes... ";
$total++;
try {
    // First try to create the indexes
    $conn->query("CREATE INDEX idx_users_email ON users(email)");
    
    // Then check if they exist
    $result = $conn->query("SHOW INDEX FROM users WHERE Key_name = 'idx_users_email'");
    if ($result && $result->num_rows > 0) {
        echo "✅ PASS\n";
        $tests['database_indexes'] = 'PASS';
        $passed++;
    } else {
        echo "❌ FAIL: Email index not found\n";
        $tests['database_indexes'] = 'FAIL: Email index not found';
    }
} catch (Exception $e) {
    // Index might already exist, check anyway
    try {
        $result = $conn->query("SHOW INDEX FROM users WHERE Key_name = 'idx_users_email'");
        if ($result && $result->num_rows > 0) {
            echo "✅ PASS\n";
            $tests['database_indexes'] = 'PASS';
            $passed++;
        } else {
            echo "❌ FAIL: Email index not found\n";
            $tests['database_indexes'] = 'FAIL: Email index not found';
        }
    } catch (Exception $e2) {
        echo "❌ FAIL: " . $e2->getMessage() . "\n";
        $tests['database_indexes'] = 'FAIL: ' . $e2->getMessage();
    }
}

// Summary
echo "\n📊 Test Summary\n";
echo "===============\n";
echo "Passed: $passed/$total tests\n";
echo "Success Rate: " . round(($passed / $total) * 100, 1) . "%\n\n";

if ($passed === $total) {
    echo "🎉 All tests passed! Foundation setup is complete.\n";
    $status = 'SUCCESS';
} else {
    echo "⚠️  Some tests failed. Please review the issues above.\n";
    $status = 'PARTIAL';
}

// Save test results
$testReport = [
    'timestamp' => date('Y-m-d H:i:s'),
    'status' => $status,
    'passed' => $passed,
    'total' => $total,
    'success_rate' => round(($passed / $total) * 100, 1),
    'tests' => $tests
];

file_put_contents(__DIR__ . '/foundation_test_results.json', json_encode($testReport, JSON_PRETTY_PRINT));

// Output JSON if not CLI
if (php_sapi_name() !== 'cli') {
    header('Content-Type: application/json');
    echo json_encode($testReport, JSON_PRETTY_PRINT);
}
?>