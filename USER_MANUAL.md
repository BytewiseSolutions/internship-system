# Internship Management System - User Manual

## System Requirements

- PHP 8.0+
- Node.js 18+
- MySQL/XAMPP
- Modern web browser

## Installation & Setup

### 1. Database Setup

1. Start XAMPP/MySQL server
2. The system will auto-create database `internshipdb` on first run

### 2. Backend Setup

```bash
cd backend
php -S localhost:8081 index.php
```

### 3. Frontend Setup

```bash
cd frontend
npm install
ng serve
```

## Access Points

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8081

## Default Accounts

### Admin Accounts

- **Email**: neosello0320@gmail.com  
  **Password**: Neo@1234

### Test Company Account

- **Email**: companyuser@example.com  
  **Password**: Company@123

## User Roles & Features

### 1. ADMIN Dashboard

**Access**: Login → Admin Dashboard

**Features**:

- Manage all users (approve/reject/suspend)
- View all companies and internships
- Monitor all applications
- Moderate reviews
- System statistics

**Key Functions**:

- Approve pending company registrations
- Manage user accounts
- Oversee system operations

### 2. COMPANY Dashboard

**Access**: Register Company → Login → Company Dashboard

**Features**:

- Post internship opportunities
- Manage applications (accept/reject)
- View company statistics
- Respond to reviews

**Registration Process**:

1. Register company user account
2. Complete company details
3. Wait for admin approval
4. Login and access dashboard

### 3. STUDENT Dashboard

**Access**: Register → Login → Student Dashboard

**Features**:

- Browse available internships
- Apply for internships (upload CV, transcript, letter)
- Track application status
- Write company reviews

**Application Process**:

1. Browse internships
2. Click "Apply"
3. Upload required documents
4. Submit application
5. Track status in dashboard

## System Workflow

### Company Registration

1. Visit `/register-company`
2. Fill user details → Next
3. Fill company details → Submit
4. Admin approval required
5. Login after approval

### Student Registration

1. Visit `/register`
2. Fill details and submit
3. Login immediately (auto-approved)

### Internship Application

1. Student browses internships
2. Clicks "Apply" on desired internship
3. Uploads CV, transcript, application letter
4. Submits application
5. Company reviews and updates status
6. Student tracks progress

### Admin Management

1. Login as admin
2. Approve pending users
3. Monitor system activity
4. Manage companies and reviews

## File Structure

```
internship-system/
├── backend/           # PHP API
│   ├── auth/         # Authentication
│   ├── applications/ # Application management
│   ├── company/      # Company operations
│   ├── internships/  # Internship management
│   └── reviews/      # Review system
├── frontend/         # Angular app
└── uploads/          # File storage
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend runs on port 8081
2. **Database Connection**: Check MySQL is running
3. **File Upload**: Check uploads folder permissions
4. **Login Issues**: Verify user status is ACTIVE

### Server Commands

```bash
# Start backend
cd backend
php -S localhost:8081 index.php

# Start frontend
cd frontend
ng serve

# Check if servers are running
# Backend: http://localhost:8081/test.php
# Frontend: http://localhost:4200
```

## Support

- Check browser console for errors
- Verify both servers are running
- Ensure database connection is active
- Clear browser cache if needed

## Security Notes

- Default passwords should be changed
- File uploads are validated
- User approval system prevents spam
- CORS configured for development

---

**System Status**: Production Ready  
**Last Updated**: October 2025
