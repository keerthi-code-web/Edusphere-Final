const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// ==============================
// REGISTER API
// ==============================

exports.register = (req, res) => {

    const {
        first_name,
        last_name,
        email,
        password
    } = req.body;

    // Validation
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        });
    }

    // Check if email already exists
    const checkEmailQuery = `
    SELECT * FROM student
    WHERE email = ?
    `;

    db.query(checkEmailQuery, [email], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err
            });
        }

        if (result.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already registered!"
            });
        }

        // Hash Password
        bcrypt.hash(password, 10, (hashError, hashedPassword) => {

            if (hashError) {
                return res.status(500).json({
                    success: false,
                    message: "Password Hashing Failed"
                });
            }

            // Insert Student
            const insertQuery = `
            INSERT INTO student
            (first_name,last_name,email,password)
            VALUES (?,?,?,?)
            `;

            db.query(
                insertQuery,
                [first_name, last_name, email, hashedPassword],
                (err, result) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Registration Failed",
                            error: err
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: "Student Registered Successfully!",
                       data: {
    studentId: result.insertId
}
                    });

                }
            );

        });

    });

};

// ==============================
// LOGIN API
// ==============================

exports.login = (req, res) => {

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required!"
        });
    }

    const sql = `
    SELECT * FROM student
    WHERE email = ?
    `;

    db.query(sql, [email], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        const student = result[0];

        // Compare Password
        bcrypt.compare(password, student.password, (err, isMatch) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Password Comparison Failed"
                });
            }

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect Password!"
                });
            }

          // Generate JWT Token
const token = jwt.sign(
    {
        studentId: student.student_id,
        email: student.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

res.status(200).json({
    success: true,
    message: "Login Successful!",
    token: token,
   user: {

    student_id: student.student_id,

    first_name: student.first_name,

    last_name: student.last_name,

    display_name: student.display_name,

    email: student.email,

    profile_completed: student.profile_completed

}
});

        });

    });

};

// ==============================
// GET CURRENT LOGGED-IN STUDENT
// ==============================

exports.getCurrentStudent = (req, res) => {

    const studentId = req.user.studentId;

    const sql = `
    SELECT
        student_id,
        first_name,
        last_name,
        display_name,
        email,
        profile_photo,
        main_goal,
        profile_completed
    FROM student
    WHERE student_id = ?
    `;

    db.query(sql, [studentId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        res.status(200).json({
            success: true,
            user: result[0]
        });

    });

};

// ==============================
// ONBOARDING API
// ==============================

exports.completeOnboarding = (req, res) => {

    const {
        studentId,
        display_name,
        profile_photo,
        main_goal
    } = req.body;

    if (!studentId || !display_name) {

        return res.status(400).json({
            success: false,
            message: "Student ID and Display Name are required!"
        });

    }

    const sql = `
    UPDATE student
    SET
        display_name = ?,
        profile_photo = ?,
        main_goal = ?,
        profile_completed = TRUE
    WHERE student_id = ?
    `;

    db.query(
        sql,
        [
            display_name,
            profile_photo || null,
            main_goal || null,
            studentId
        ],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Onboarding Update Failed",
                    error: err
                });

            }

            return res.status(200).json({

                success: true,
                message: "Onboarding Completed Successfully!"

            });

        }
    );

};

// ==============================
// UPDATE PROFILE
// ==============================

exports.updateProfile = (req, res) => {

    const studentId = req.user.studentId;

    const {
        display_name,
        profile_photo
    } = req.body;

    if (!display_name) {
        return res.status(400).json({
            success: false,
            message: "Display Name is required."
        });
    }

    const sql = `
    UPDATE student
    SET
        display_name = ?,
        profile_photo = ?
    WHERE student_id = ?
    `;

    db.query(
        sql,
        [
            display_name,
            profile_photo || null,
            studentId
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Profile Update Failed",
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: "Profile Updated Successfully!"
            });

        }
    );

};

// ==============================
// UPLOAD PROFILE PHOTO
// ==============================

exports.uploadProfilePhoto = (req, res) => {

    const studentId = req.user.studentId;

    if (!req.file) {

        return res.status(400).json({
            success: false,
            message: "No image uploaded."
        });

    }

    const profilePhoto =
        `/uploads/profile/${req.file.filename}`;

    const sql = `
        UPDATE student
        SET profile_photo = ?
        WHERE student_id = ?
    `;

    db.query(
        sql,
        [profilePhoto, studentId],
        (err) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Profile photo upload failed.",
                    error: err
                });

            }

            return res.status(200).json({

                success: true,

                message: "Profile photo uploaded successfully.",

                profile_photo: profilePhoto

            });

        }
    );

};