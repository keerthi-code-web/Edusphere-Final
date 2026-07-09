CREATE TABLE Student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    semester INT NOT NULL,
    profile_photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SHOW TABLES;
DESCRIBE Student;



CREATE TABLE Study_Plan (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    study_days INT NOT NULL,
    daily_activity TEXT NOT NULL,
    estimated_hours DECIMAL(4,2) NOT NULL,
    status ENUM('Active','Completed') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
    REFERENCES Student(student_id)
);
SHOW TABLES;
DESCRIBE Study_Plan;



CREATE TABLE Task (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    task_name VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status ENUM('Pending','Completed') DEFAULT 'Pending',
    completed_at TIMESTAMP NULL,

    FOREIGN KEY (student_id)
    REFERENCES Student(student_id)
);
DESCRIBE Task;



CREATE TABLE Resource (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    resource_name VARCHAR(150) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    resource_type ENUM('Notes','Previous Year Paper','Important Questions') NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
    REFERENCES Student(student_id)
);
DESCRIBE Resource;



CREATE TABLE Exam (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    exam_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
    REFERENCES Student(student_id)
);
DESCRIBE Exam;



CREATE TABLE Progress_History (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    week_start DATE NOT NULL,
    consistency_score DECIMAL(5,2),
    productivity_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
    REFERENCES Student(student_id)
);
DESCRIBE Progress_History;



CREATE TABLE Feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending','Reviewed') DEFAULT 'Pending',

    FOREIGN KEY (student_id)
    REFERENCES Student(student_id)
);
DESCRIBE Feedback;



CREATE TABLE Admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
DESCRIBE Admin;



CREATE TABLE Announcement (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    category ENUM('General','Academic','Event') DEFAULT 'General',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Active','Inactive') DEFAULT 'Active',

    FOREIGN KEY (admin_id)
    REFERENCES Admin(admin_id)
);
DESCRIBE Announcement;

SHOW TABLES;

SHOW CREATE TABLE Student;

SHOW CREATE TABLE Study_Plan;

SHOW CREATE TABLE Task;

SELECT DATABASE();

USE defaultdb;
DESCRIBE student;
SHOW COLUMNS FROM student;
ALTER TABLE student
DROP COLUMN full_name;
ALTER TABLE student
ADD COLUMN first_name VARCHAR(50) NOT NULL AFTER student_id;
ALTER TABLE student
ADD COLUMN last_name VARCHAR(50) NOT NULL AFTER first_name;
DESCRIBE student;
ALTER TABLE student
DROP COLUMN semester;
DESCRIBE student;
ALTER TABLE student
MODIFY display_name VARCHAR(50) NULL;
DESCRIBE student;
SELECT * FROM student;
SELECT * FROM student;
USE defaultdb;
DESCRIBE task;
SELECT * FROM task;
SELECT * FROM task;
SHOW TABLES;
DESCRIBE study_plan;
SELECT * FROM study_plan;
SHOW TABLES;
DESCRIBE resource;
SELECT * FROM resource;
SHOW TABLES;
DESCRIBE exam;
SELECT * FROM exam;
SHOW TABLES;
DESCRIBE progress_history;
SELECT * FROM progress_history;
SHOW TABLES;
DESCRIBE feedback;
SELECT * FROM feedback;
DESCRIBE announcement;
SHOW TABLES;
DESCRIBE admin;
SELECT * FROM admin;
DESCRIBE announcement;
SELECT admin_id, name, email FROM admin;
USE defaultdb;

SELECT * FROM announcement;
SELECT announcement_id, title
FROM announcement;
SELECT * FROM announcement;
