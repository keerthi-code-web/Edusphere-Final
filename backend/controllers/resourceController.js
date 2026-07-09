const db = require("../config/db");

exports.createResource = (req, res) => {

    const student_id = req.user.studentId;

    const {
        resource_name,
        subject,
        semester,
        resource_type,
        file_path
    } = req.body;

    if (
        !resource_name ||
        !subject ||
        !semester ||
        !resource_type ||
        !file_path
    ) {
        return res.status(400).json({
            success:false,
            message:"All fields are required!"
        });
    }

    const sql = `
    INSERT INTO resource
    (
        student_id,
        resource_name,
        subject,
        semester,
        resource_type,
        file_path
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql,
        [
            student_id,
            resource_name,
            subject,
            semester,
            resource_type,
            file_path
        ],
        (err,result)=>{

            if(err){
                return res.status(500).json({
                    success:false,
                    message:"Resource Creation Failed",
                    error:err
                });
            }

            
            return res.status(201).json({
    success: true,
    message: "Resource Added Successfully!",
    data: {
        resourceId: result.insertId
    }
});

        });

};
exports.getResources = (req,res)=>{

    const student_id = req.user.studentId;

    const sql = `
    SELECT *
    FROM resource
    WHERE student_id=?
    ORDER BY uploaded_at DESC
    `;

    db.query(sql,[student_id],(err,result)=>{

        if(err){

            return res.status(500).json({
                success:false,
                message:"Failed to Fetch Resources",
                error:err
            });

        }

        return res.status(200).json({
    success: true,
    message: "Resources Fetched Successfully!",
    count: result.length,
    data: result
});

    });

};
exports.updateResource=(req,res)=>{

    const student_id=req.user.studentId;
    const resourceId=req.params.resourceId;

    const{
        resource_name,
        subject,
        semester,
        resource_type,
        file_path
    }=req.body;

    const sql=`
    UPDATE resource
    SET
    resource_name=?,
    subject=?,
    semester=?,
    resource_type=?,
    file_path=?
    WHERE resource_id=? AND student_id=?
    `;

    db.query(sql,
    [
        resource_name,
        subject,
        semester,
        resource_type,
        file_path,
        resourceId,
        student_id
    ],
    (err,result)=>{

        if(err){

            return res.status(500).json({
                success:false,
                message:"Resource Update Failed",
                error:err
            });

        }

        return res.status(200).json({
            success:true,
            message:"Resource Updated Successfully!"
        });

    });

};
exports.deleteResource=(req,res)=>{

    const student_id=req.user.studentId;
    const resourceId=req.params.resourceId;

    const sql=`
    DELETE FROM resource
    WHERE resource_id=? AND student_id=?
    `;

    db.query(sql,[resourceId,student_id],(err,result)=>{

        if(err){

            return res.status(500).json({
                success:false,
                message:"Resource Deletion Failed",
                error:err
            });

        }

        if(result.affectedRows===0){

            return res.status(404).json({
                success:false,
                message:"Resource Not Found!"
            });

        }

        return res.status(200).json({
            success:true,
            message:"Resource Deleted Successfully!"
        });

    });

};