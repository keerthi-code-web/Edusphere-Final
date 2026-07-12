# Database

## Overview

EduSphere uses **MySQL** as its relational database, hosted on **Aiven Cloud** for secure online access.

The database stores all academic information required by the platform, including student accounts, study plans, learning resources, tasks, academic progress, administrator information, and student feedback.

---

## Database Tables

* student
* admin
* task
* studyplan
* resource
* progress
* feedback

---

## Backup

The complete SQL database backup is provided as:

```
edusphere.sql
```

This backup can be imported directly into any MySQL 8.x server to recreate the complete database structure and data.

---

## Database Features

* Relational Database Design
* Primary & Foreign Key Relationships
* Secure Authentication Support
* Cloud Hosted (Aiven MySQL)
* Production Ready
