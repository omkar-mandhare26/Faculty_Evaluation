import jwt from "jsonwebtoken";

function getUserType(req) {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return { type: null, username: null, name: null, error: true, errorMessage: "No token found" };
    }

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key);

        return { type: decoded.type, user: decoded.username, name: decoded.fullName, error: false };
    } catch (error) {
        return { type: null, username: null, name: null, error: true, errorMessage: error.message };
    }
}

export default getUserType;
