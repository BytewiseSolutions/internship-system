-- Database Backup
-- Generated: 2025-11-16 05:29:39

-- Table: applications
DROP TABLE IF EXISTS `applications`;
CREATE TABLE `applications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `internship_id` int NOT NULL,
  `student_id` int NOT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED') DEFAULT 'PENDING',
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cv_path` varchar(255) DEFAULT NULL,
  `transcript_path` varchar(255) DEFAULT NULL,
  `application_letter_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`application_id`),
  KEY `idx_applications_internship_id` (`internship_id`),
  KEY `idx_applications_student_id` (`student_id`),
  KEY `idx_applications_status` (`status`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`internship_id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `applications` VALUES
('1','3','1','ACCEPTED','2025-11-04 15:26:08',NULL,'uploads/6909fef0b664c_lebo.pdf','uploads/6909fef0b6d2c_SchoolConnect_Project_Report.docx');

-- Table: companies
DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `company_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_by` int NOT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`company_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `companies_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `companies` VALUES
('1','Bytewise Solutions','bytewise@solutions.tech','Maseru, Ha Abia','1','ACTIVE','2025-11-04 15:03:17');

-- Table: courses
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `school_id` int NOT NULL,
  `course_name` varchar(100) NOT NULL,
  PRIMARY KEY (`course_id`),
  KEY `school_id` (`school_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `courses` VALUES
('1','1','Computing'),
('2','1','Mobile Computing');

-- Table: internships
DROP TABLE IF EXISTS `internships`;
CREATE TABLE `internships` (
  `internship_id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `requirements` text,
  `responsibilities` text,
  `location` varchar(255) NOT NULL,
  `work_type` enum('REMOTE','ON_SITE','HYBRID') DEFAULT 'ON_SITE',
  `duration_months` int DEFAULT '3',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `application_deadline` date NOT NULL,
  `salary_range` varchar(100) DEFAULT NULL,
  `positions_available` int DEFAULT '1',
  `required_skills` text,
  `preferred_qualifications` text,
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `status` enum('OPEN','CLOSED','DRAFT') DEFAULT 'OPEN',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`internship_id`),
  KEY `idx_internships_company_id` (`company_id`),
  KEY `idx_internships_status` (`status`),
  CONSTRAINT `internships_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `internships` VALUES
('1','1','Software Development Intern','Assist in developing and testing software applications.','Basic knowledge of Java or Python.','Work with senior developers on assigned modules.','Maseru','HYBRID','3','2025-10-01','2026-01-01','2025-10-30','R3000 - R5000','2','Java, MySQL, Git','Degree in Computing or IT','John Doe','hr@inntech.co.ls','+26650000001','OPEN','2025-11-04 15:04:01','2025-11-04 15:04:01'),
('2','1','Graphic Design Intern','Create social media and digital designs for marketing.','Knowledge of Adobe Photoshop or Illustrator.','Design visuals based on marketing briefs.','Maseru','REMOTE','3','2025-11-01','2026-02-01','2025-11-04','R2500 - R4000','1','Photoshop, Canva','Diploma in Graphic Design','Mpho Mokete','design@inntech.co.ls','+26650000002','OPEN','2025-11-04 15:04:01','2025-11-04 15:04:01'),
('3','1','Data Analysis Intern','Assist in analyzing business datasets for trends and reports.','Knowledge of Excel or Python Pandas.','Prepare and visualize data for projects.','Maseru','ON_SITE','4','2025-11-03','2026-03-03','2025-11-05','R4000 - R6000','1','Python, Excel','BSc in Statistics or Data Science','Thabo Nthako','data@inntech.co.ls','+26650000003','OPEN','2025-11-04 15:04:01','2025-11-04 15:04:01'),
('4','1','Marketing & Communications Intern','Help coordinate campaigns and content strategies.','Strong communication skills.','Assist in managing social media content.','Maseru','HYBRID','6','2025-11-05','2026-05-05','2025-11-07','R3500 - R4500','1','Social Media, Copywriting','Marketing background preferred','Nthabiseng Letsie','marketing@inntech.co.ls','+26650000004','OPEN','2025-11-04 15:04:01','2025-11-04 15:04:01'),
('5','1','IT Support Intern','Provide basic IT support and troubleshooting.','Basic understanding of computer systems.','Support office network and system setup.','Maseru','ON_SITE','6','2025-11-06','2026-05-06','2025-11-10','R3000 - R4500','1','Networking, Troubleshooting','Diploma in IT','Rethabile Moeletsi','support@inntech.co.ls','+26650000005','OPEN','2025-11-04 15:04:01','2025-11-04 15:04:01');

-- Table: lecturer_courses
DROP TABLE IF EXISTS `lecturer_courses`;
CREATE TABLE `lecturer_courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lecturer_id` int NOT NULL,
  `course_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_assignment` (`lecturer_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `lecturer_courses_ibfk_1` FOREIGN KEY (`lecturer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `lecturer_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: logbook
DROP TABLE IF EXISTS `logbook`;
CREATE TABLE `logbook` (
  `logbook_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `week_number` int NOT NULL,
  `week_ending` date NOT NULL,
  `activities_completed` text,
  `skills_learned` text,
  `challenges_faced` text,
  `supervisor_feedback` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`logbook_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `logbook_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: notifications
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `notifications` VALUES
('1','4','Your application for Data Analysis Intern has been ACCEPTED','0','2025-11-04 15:54:52');

-- Table: reviews
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `internship_id` int NOT NULL,
  `rating` int NOT NULL,
  `review_text` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `student_id` (`student_id`),
  KEY `internship_id` (`internship_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`internship_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: schools
DROP TABLE IF EXISTS `schools`;
CREATE TABLE `schools` (
  `school_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `schools` VALUES
('1','Botho University','Maseru, Ha Abia','2025-11-04 15:23:12');

-- Table: students
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `school_id` int NOT NULL,
  `course_id` int DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  KEY `user_id` (`user_id`),
  KEY `school_id` (`school_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`) ON DELETE CASCADE,
  CONSTRAINT `students_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `students` VALUES
('1','4','1','1');

-- Table: users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('SYSTEM_ADMIN','SCHOOL_ADMIN','LECTURER','STUDENT','COMPANY','EMPLOYER') NOT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `school_id` int DEFAULT NULL,
  `company_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` VALUES
('1','System Admin','admin@system.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','SYSTEM_ADMIN','ACTIVE','2025-11-04 14:47:14',NULL,NULL),
('2','Lebohang Monamane','lebohangmonamane3@gmail.com','$2y$10$HSjiuexqz/w4.yVDSIuvju9CwIrmE9QqIZ6jjpkNHOQCEOBdtY/Xq','EMPLOYER','ACTIVE','2025-11-04 15:03:34',NULL,'1'),
('3','Lerato Masupha','lerato@gmail.com','$2y$10$dvCc19H66ftve1UrYHca4OWZZKzgnQXmDtcN0sVYQrzZghaZ9HkCu','SCHOOL_ADMIN','ACTIVE','2025-11-04 15:23:52','1',NULL),
('4','Lineo Sello','lineo@gmail.com','$2y$10$ugxaEAKoc.TTghC1d4DxTeZkEMWAFgnk26dj80CrQ9vDYT043XZJa','STUDENT','ACTIVE','2025-11-04 15:25:00',NULL,NULL);

