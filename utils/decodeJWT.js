import jwt from "jsonwebtoken";

function decodeJWT(req) {
    try {
        const token = req.cookies.token || req.headers.authorization;
        // const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.jwt_secret_key);
        return { decoded, error: false };
    } catch (err) {
        return { decoded: null, error: true };
    }
}

export default decodeJWT;
