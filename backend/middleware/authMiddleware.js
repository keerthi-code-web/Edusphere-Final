const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access Denied! No Token Provided."
        });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid Token!"
        });

    }

};

module.exports = verifyToken;