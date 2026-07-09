const db = require("../config/db");

exports.createAnnouncement = (req, res) => {
     console.log("===== CREATE ANNOUNCEMENT =====");
    console.log(req.body);

    const admin_id = 1;

  

    const {
        title,
        message,
        category
    } = req.body;

    if (!title || !message) {

        return res.status(400).json({
            success: false,
            message: "Title and Message are required!"
        });

    }

    const sql = `
    INSERT INTO announcement
    (
        admin_id,
        title,
        message,
        category
    )
    VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            admin_id,
            title,
            message,
            category || "General"
        ],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Announcement Creation Failed",
                    error: err
                });

            }

           return res.status(201).json({
    success: true,
    message: "Announcement Published Successfully!",
    data: {
        announcementId: result.insertId
    }
});

        });

};
exports.getAnnouncements = (req, res) => {

    const sql = `
    SELECT *
    FROM announcement
    WHERE status='Active'
    ORDER BY published_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Failed to Fetch Announcements",
                error: err
            });

        }

       return res.status(200).json({
    success: true,
    message: "Announcements Fetched Successfully!",
    count: result.length,
    data: result
});

    });

};
exports.updateAnnouncement = (req, res) => {

    const announcementId = req.params.announcementId;

    const {
        title,
        message,
        category,
        status
    } = req.body;

    const sql = `
    UPDATE announcement
    SET
    title=?,
    message=?,
    category=?,
    status=?
    WHERE announcement_id=?
    `;

    db.query(
        sql,
        [
            title,
            message,
            category,
            status,
            announcementId
        ],
        (err, result) => {

            if (err) {

                return res.status(500).json({

                    success:false,
                    message:"Announcement Update Failed",
                    error:err

                });

            }

            return res.status(200).json({

                success:true,
                message:"Announcement Updated Successfully!"

            });

        });

};
exports.deleteAnnouncement = (req,res)=>{

    const announcementId=req.params.announcementId;

    const sql=`
    DELETE FROM announcement
    WHERE announcement_id=?
    `;

    db.query(sql,[announcementId],(err,result)=>{

        if(err){

            return res.status(500).json({

                success:false,
                message:"Announcement Delete Failed",
                error:err

            });

        }

        if(result.affectedRows===0){

            return res.status(404).json({

                success:false,
                message:"Announcement Not Found!"

            });

        }

        return res.status(200).json({

            success:true,
            message:"Announcement Deleted Successfully!"

        });

    });

};