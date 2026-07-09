const db = require("../config/db");

exports.createTask = (req, res) => {

    // Student ID comes from JWT
    const student_id = req.user.studentId;

    const {
        task_name,
        subject,
        description,
        due_date
    } = req.body;

    // Validation
    if (!task_name || !due_date) {
        return res.status(400).json({
            success: false,
            message: "Task Name and Due Date are required!"
        });
    }

    const sql = `
    INSERT INTO task
    (
        student_id,
        task_name,
        subject,
        description,
        due_date,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            student_id,
            task_name,
            subject || null,
            description || null,
            due_date,
            "Pending"
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Task Creation Failed",
                    error: err
                });
            }

           return res.status(201).json({
    success: true,
    message: "Task Created Successfully!",
    data: {
        taskId: result.insertId
    }
});
        }
    );

};

exports.getTasks = (req, res) => {

    const student_id = req.user.studentId;

    const sql = `
    SELECT *
    FROM task
    WHERE student_id = ?
    ORDER BY due_date ASC
    `;

    db.query(sql, [student_id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to Fetch Tasks",
                error: err
            });
        }

       return res.status(200).json({
    success: true,
    message: "Tasks Fetched Successfully!",
    count: result.length,
    data: result
});

    });

};

exports.updateTask = (req, res) => {

    const student_id = req.user.studentId;
    const taskId = req.params.taskId;

    const {
        task_name,
        subject,
        description,
        due_date,
        status
    } = req.body;

    let sql = "";
    let values = [];

    if (status === "Completed") {

        sql = `
        UPDATE task
        SET status = ?,
            completed_at = CURRENT_TIMESTAMP
        WHERE task_id = ? AND student_id = ?
        `;

        values = ["Completed", taskId, student_id];

    } else {

        sql = `
        UPDATE task
        SET task_name = ?,
            subject = ?,
            description = ?,
            due_date = ?
        WHERE task_id = ? AND student_id = ?
        `;

        values = [
            task_name,
            subject || null,
            description || null,
            due_date,
            taskId,
            student_id
        ];

    }

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Task Update Failed",
                error: err
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task Updated Successfully!"
        });

    });

};

exports.deleteTask = (req, res) => {

    const student_id = req.user.studentId;
    const taskId = req.params.taskId;

    const sql = `
    DELETE FROM task
    WHERE task_id = ? AND student_id = ?
    `;

    db.query(sql, [taskId, student_id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Task Deletion Failed",
                error: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task Deleted Successfully!"
        });

    });

};