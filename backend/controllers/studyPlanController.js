const db = require("../config/db");

exports.createStudyPlan = (req, res) => {

    const student_id = req.user.studentId;

    const {
        plan_name,
        subject,
        study_days,
        estimated_hours
    } = req.body;

    // Validation
    if (
        !plan_name ||
        !subject ||
        !study_days ||
        !estimated_hours
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        });
    }

    const sql = `
    INSERT INTO study_plan
    (
        student_id,
        plan_name,
        subject,
        study_days,
        estimated_hours,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            student_id,
            plan_name,
            subject,
            study_days,
            estimated_hours,
            "Active"
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Study Plan Creation Failed",
                    error: err
                });
            }

            return res.status(201).json({
    success: true,
    message: "Study Plan Created Successfully!",
    data: {
        planId: result.insertId
    }
});

        }
    );

};
exports.getStudyPlans = (req, res) => {

    const student_id = req.user.studentId;

    const sql = `
    SELECT *
    FROM study_plan
    WHERE student_id = ?
    ORDER BY created_at DESC
    `;

    db.query(sql, [student_id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to Fetch Study Plans",
                error: err
            });
        }

       return res.status(200).json({
    success: true,
    message: "Study Plans Fetched Successfully!",
    count: result.length,
    data: result
});

    });

};
exports.updateStudyPlan = (req, res) => {

    const student_id = req.user.studentId;
    const planId = req.params.planId;

    const {
        plan_name,
        subject,
        study_days,
        
        estimated_hours,
        status
    } = req.body;

    const sql = `
    UPDATE study_plan
    SET
        plan_name = ?,
        subject = ?,
        study_days = ?,
       
        estimated_hours = ?,
        status = ?
    WHERE plan_id = ? AND student_id = ?
    `;

    db.query(
        sql,
        [
            plan_name,
            subject,
            study_days,
          
            estimated_hours,
            status || "Active",
            planId,
            student_id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success:false,
                    message:"Study Plan Update Failed",
                    error:err
                });
            }

            return res.status(200).json({
                success:true,
                message:"Study Plan Updated Successfully!"
            });

        }
    );

};
exports.deleteStudyPlan = (req, res) => {

    const student_id = req.user.studentId;
    const planId = req.params.planId;

    const sql = `
    DELETE FROM study_plan
    WHERE plan_id = ? AND student_id = ?
    `;

    db.query(sql,[planId,student_id],(err,result)=>{

        if(err){

            return res.status(500).json({
                success:false,
                message:"Study Plan Deletion Failed",
                error:err
            });

        }

        if(result.affectedRows===0){

            return res.status(404).json({
                success:false,
                message:"Study Plan Not Found!"
            });

        }

        return res.status(200).json({
            success:true,
            message:"Study Plan Deleted Successfully!"
        });

    });

};