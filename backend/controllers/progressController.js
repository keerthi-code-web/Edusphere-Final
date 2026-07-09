const db = require("../config/db");

exports.createProgress = (req, res) => {

    const student_id = req.user.studentId;

    const {
        week_start,
        consistency_score,
        productivity_score,
        overall_score
    } = req.body;

    if (
        !week_start ||
        consistency_score == null ||
        productivity_score == null ||
        overall_score == null
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        });
    }

    const sql = `
    INSERT INTO progress_history
    (
        student_id,
        week_start,
        consistency_score,
        productivity_score,
        overall_score
    )
    VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            student_id,
            week_start,
            consistency_score,
            productivity_score,
            overall_score
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Progress Creation Failed",
                    error: err
                });
            }

         return res.status(201).json({
    success: true,
    message: "Progress Added Successfully!",
    data: {
        progressId: result.insertId
    }
});

        }
    );

};
exports.getProgress = (req, res) => {

    const student_id = req.user.studentId;

    const sql = `
    SELECT *
    FROM progress_history
    WHERE student_id=?
    ORDER BY week_start DESC
    `;

    db.query(sql, [student_id], (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Failed to Fetch Progress",
                error: err
            });

        }

        return res.status(200).json({
    success: true,
    message: "Progress Records Fetched Successfully!",
    count: result.length,
    data: result
});

    });

};
exports.updateProgress = (req, res) => {

    const student_id = req.user.studentId;
    const progressId = req.params.progressId;

    const {
        week_start,
        consistency_score,
        productivity_score,
        overall_score
    } = req.body;

    const sql = `
    UPDATE progress_history
    SET
        week_start=?,
        consistency_score=?,
        productivity_score=?,
        overall_score=?
    WHERE progress_id=?
    AND student_id=?
    `;

    db.query(
        sql,
        [
            week_start,
            consistency_score,
            productivity_score,
            overall_score,
            progressId,
            student_id
        ],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Progress Update Failed",
                    error: err
                });

            }

            return res.status(200).json({
                success: true,
                message: "Progress Updated Successfully!"
            });

        }
    );

};
exports.deleteProgress = (req, res) => {

    const student_id = req.user.studentId;
    const progressId = req.params.progressId;

    const sql = `
    DELETE FROM progress_history
    WHERE progress_id=?
    AND student_id=?
    `;

    db.query(sql, [progressId, student_id], (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Progress Deletion Failed",
                error: err
            });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Progress Record Not Found!"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Progress Deleted Successfully!"
        });

    });

};