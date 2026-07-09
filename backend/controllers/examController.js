const db = require("../config/db");

exports.createExam = (req, res) => {

    const student_id = req.user.studentId;

    const {
        subject,
        exam_date
    } = req.body;

    if (!subject || !exam_date) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        });
    }

    const sql = `
        INSERT INTO exam
        (student_id, subject, exam_date)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [student_id, subject, exam_date],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Exam Creation Failed",
                    error: err
                });
            }

            return res.status(201).json({
    success: true,
    message: "Exam Added Successfully!",
    data: {
        examId: result.insertId
    }
});

        }
    );

};
exports.getExams = (req, res) => {

    const student_id = req.user.studentId;

    const sql = `
        SELECT *
        FROM exam
        WHERE student_id = ?
        ORDER BY exam_date ASC
    `;

    db.query(sql, [student_id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to Fetch Exams",
                error: err
            });
        }

        return res.status(200).json({
    success: true,
    message: "Exams Fetched Successfully!",
    count: result.length,
    data: result
});

    });

};
exports.updateExam = (req, res) => {

    const student_id = req.user.studentId;
    const examId = req.params.examId;

    const {
        subject,
        exam_date
    } = req.body;

    const sql = `
        UPDATE exam
        SET
            subject = ?,
            exam_date = ?
        WHERE exam_id = ?
        AND student_id = ?
    `;

    db.query(
        sql,
        [subject, exam_date, examId, student_id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Exam Update Failed",
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: "Exam Updated Successfully!"
            });

        }
    );

};
exports.deleteExam = (req, res) => {

    const student_id = req.user.studentId;
    const examId = req.params.examId;

    const sql = `
        DELETE FROM exam
        WHERE exam_id = ?
        AND student_id = ?
    `;

    db.query(sql, [examId, student_id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Exam Deletion Failed",
                error: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Exam Not Found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Exam Deleted Successfully!"
        });

    });

};