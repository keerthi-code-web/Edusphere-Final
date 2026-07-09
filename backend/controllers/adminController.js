const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createAdmin = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
        INSERT INTO admin
        (
            name,
            email,
            password
        )
        VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [
                name,
                email,
                hashedPassword
            ],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Admin Creation Failed",
                        error: err
                    });
                }

                return res.status(201).json({
    success:true,
    message:"Admin Created Successfully!",
    data:{
        adminId:result.insertId
    }
});

            }
        );

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server Error",
            error
        });

    }

};

exports.loginAdmin = (req, res) => {

    const {
        email,
        password
    } = req.body;

    const sql = `
    SELECT *
    FROM admin
    WHERE email=?
    `;

    db.query(sql, [email], async (err, result) => {

        if (err) {

            return res.status(500).json({
                success:false,
                message:"Login Failed",
                error:err
            });

        }

        if(result.length===0){

            return res.status(404).json({
                success:false,
                message:"Admin Not Found!"
            });

        }

        const admin=result[0];

        const isMatch=await bcrypt.compare(password,admin.password);

        if(!isMatch){

            return res.status(401).json({
                success:false,
                message:"Invalid Password!"
            });

        }

        const token=jwt.sign(

            {
                adminId:admin.admin_id,
                email:admin.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"7d"
            }

        );

        return res.status(200).json({

            success:true,
            message:"Admin Login Successful!",
            token

        });

    });

};
exports.getAdmins = (req,res)=>{

    const sql="SELECT admin_id,name,email FROM admin";

    db.query(sql,(err,result)=>{

        if(err){

            return res.status(500).json({

                success:false,
                message:"Failed to Fetch Admins",
                error:err

            });

        }
return res.status(200).json({

    success:true,
    message:"Admins Fetched Successfully!",
    count:result.length,
    data:result

});

    });

};
exports.updateAdmin=async(req,res)=>{

    const adminId=req.params.adminId;

    const{
        name,
        email
    }=req.body;

    const sql=`
    UPDATE admin
    SET
    name=?,
    email=?
    WHERE admin_id=?
    `;

    db.query(sql,[name,email,adminId],(err,result)=>{

        if(err){

            return res.status(500).json({

                success:false,
                message:"Admin Update Failed",
                error:err

            });

        }

        return res.status(200).json({

            success:true,
            message:"Admin Updated Successfully!"

        });

    });

};
exports.deleteAdmin=(req,res)=>{

    const adminId=req.params.adminId;

    const sql="DELETE FROM admin WHERE admin_id=?";

    db.query(sql,[adminId],(err,result)=>{

        if(err){

            return res.status(500).json({

                success:false,
                message:"Admin Delete Failed",
                error:err

            });

        }


        if(result.affectedRows===0){

    return res.status(404).json({

        success:false,
        message:"Admin Not Found!"

    });

}


        return res.status(200).json({

            success:true,
            message:"Admin Deleted Successfully!"

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
    JOIN student
    ON feedback.student_id = student.student_id
    ORDER BY feedback.submitted_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            return res.status(500).json({

                success: false,
                message: "Failed to fetch feedback",
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