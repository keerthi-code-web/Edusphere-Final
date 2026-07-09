const db = require("../config/db");

exports.createFeedback = (req, res) => {

    const student_id = req.user.studentId;

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            success: false,
            message: "Message is required!"
        });
    }

    const sql = `
    INSERT INTO feedback
    (
        student_id,
        message
    )
    VALUES (?, ?)
    `;

    db.query(sql, [student_id, message], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Feedback Submission Failed",
                error: err
            });
        }

       return res.status(201).json({
    success: true,
    message: "Feedback Submitted Successfully!",
    data: {
        feedbackId: result.insertId
    }
});

    });

};

exports.getFeedback = (req, res) => {

    const student_id = req.user.studentId;

    const sql = `
    SELECT *
    FROM feedback
    WHERE student_id=?
    ORDER BY submitted_at DESC
    `;

    db.query(sql, [student_id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to Fetch Feedback",
                error: err
            });
        }

        return res.status(200).json({
    success: true,
    message: "Feedback Records Fetched Successfully!",
    count: result.length,
    data: result
});

    });

};

exports.getAllFeedback = (req, res) => {

    const sql = `
    SELECT
        feedback.feedback_id,
        feedback.message,
        feedback.status,
        feedback.submitted_at,
        student.first_name,
        student.last_name
    FROM feedback
    INNER JOIN student
    ON feedback.student_id = student.student_id
    ORDER BY feedback.submitted_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Failed to Fetch All Feedback",
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


exports.updateFeedback = (req, res) => {

    const student_id = req.user.studentId;
    const feedbackId = req.params.feedbackId;

    const { message } = req.body;

    const sql = `
    UPDATE feedback
    SET message=?
    WHERE feedback_id=? AND student_id=?
    `;

    db.query(sql,
    [message, feedbackId, student_id],
    (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Feedback Update Failed",
                error: err
            });
        }

        return res.status(200).json({
            success: true,
            message: "Feedback Updated Successfully!"
        });

    });

};

exports.deleteFeedback = (req, res) => {

    const student_id = req.user.studentId;
    const feedbackId = req.params.feedbackId;

    const sql = `
    DELETE FROM feedback
    WHERE feedback_id=? AND student_id=?
    `;

    db.query(sql,
    [feedbackId, student_id],
    (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Feedback Deletion Failed",
                error: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Feedback Not Found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Feedback Deleted Successfully!"
        });

    });

};

exports.updateFeedbackStatus = (req, res) => {

    const feedbackId = req.params.feedbackId;

    const { status } = req.body;

    const sql = `
    UPDATE feedback
    SET status=?
    WHERE feedback_id=?
    `;

    db.query(

        sql,

        [
            status,
            feedbackId
        ],

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    success:false,
                    message:"Failed to update feedback",
                    error:err

                });

            }

            return res.status(200).json({

                success:true,
                message:"Feedback status updated."

            });

        }

    );

};