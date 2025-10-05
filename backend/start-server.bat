@echo off
echo Starting PHP Development Server on port 8081...
echo.
echo Backend will be available at: http://localhost:8081
echo Test endpoint: http://localhost:8081/test.php
echo Auth test: http://localhost:8081/auth/test-register.php
echo.
php -S localhost:8081 -t .
pause