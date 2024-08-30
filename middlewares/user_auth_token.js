import jwt from "jsonwebtoken";

const userAuthenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key);

        if (decoded.type === "user") {
            req.user = decoded;
            next();
        } else {
            return res.redirect("/login");
        }
    } catch (error) {
        return res.redirect("/login");
    }
};

export default userAuthenticateToken;
