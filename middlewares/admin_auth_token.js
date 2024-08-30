import jwt from "jsonwebtoken";

const adminAuthenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.redirect("/admin/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key);

        if (decoded.type === "admin") {
            req.user = decoded;
            next();
        } else {
            return res.redirect("/admin/login");
        }
    } catch (error) {
        return res.redirect("/admin/login");
    }
};

export default adminAuthenticateToken;
