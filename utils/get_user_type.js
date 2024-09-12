import jwt from "jsonwebtoken";

function getUserType(req) {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return { type: null, token: null, error: true };
    }

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key);

        return { type: decoded.type, user: decoded, token: token, error: false };
    } catch (error) {
        return { type: null, token: null, error: true };
    }
}

export default getUserType;
