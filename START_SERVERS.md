# How to Start the Internship System

## Prerequisites
- PHP 7.4+ installed
- Node.js 18+ installed
- MySQL/XAMPP running

## Backend Setup (Terminal 1)
```bash
cd backend
php -S localhost:8081 -t .
```

Or double-click `start-server.bat` in the backend folder.

## Frontend Setup (Terminal 2)
```bash
cd frontend
npm install
ng serve
```

## Access Points
- Frontend: http://localhost:4200
- Backend API: http://localhost:8081

## Default Admin Login
- Email: monamane.lebohang45@gmail.com
- Password: Lebo@123

## Troubleshooting
1. If CORS errors persist, ensure backend is running on port 8081
2. Check MySQL is running (XAMPP/WAMP)
3. Verify database 'internshipdb' exists
4. Clear browser cache if needed