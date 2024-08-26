import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key);
        req.user = decoded;
        next();
    } catch (error) {
        return res.redirect("/login");
    }
};

export default authenticateToken;
