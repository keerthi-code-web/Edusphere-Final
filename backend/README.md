# Backend

## Overview

The backend of EduSphere is developed using **Node.js** and **Express.js**. It provides secure REST APIs for authentication, student management, task management, study planning, knowledge resources, academic progress tracking, feedback management, profile management, and administrator functions.

JWT-based authentication is implemented to protect secured routes and ensure authorized access.

---

## Technologies Used

* Node.js
* Express.js
* MySQL
* JWT Authentication
* Multer
* bcrypt
* dotenv
* CORS

---

## Main Modules

* Authentication
* Student Profile
* Mission Control (Tasks)
* Knowledge Vault
* StudyPath
* ProgressIQ
* Feedback
* Administrator

---

## API Features

* Student Registration
* Student Login
* Admin Login
* JWT Authentication
* CRUD Operations
* File Upload Support
* Profile Management
* Feedback Management
* Progress Tracking

---

## Server

Development Server

```bash
npm install
npm start
```

The backend communicates with the MySQL database hosted on Aiven Cloud and serves API requests for the frontend application.
