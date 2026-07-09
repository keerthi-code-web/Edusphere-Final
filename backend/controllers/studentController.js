const db = require("../config/db");

exports.getStudents = (req, res) => {

    const sql = `
    SELECT
    student_id,
    first_name,
    last_name,
    email,
    created_at
FROM student
    ORDER BY student_id ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Failed to fetch students",
                error: err
            });

        }

        return res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });

    });

};