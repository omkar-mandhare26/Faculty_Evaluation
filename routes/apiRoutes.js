import { Router } from "express";

const router = Router();
dotenv.config();
router.use(cookieParser());

router.get("/get-decoded-jwt", (req, res) => {
    const decoded = decodeJWT(req);
    if (decoded.err)
        res.json({
            error: decoded.err
        });
    else res.json(decoded);
});

router.get("/users/get-user-type", userAuthenticateToken, (req, res) => {
    try {
        const userType = getUserType(req);
        res.json(userType);
    } catch (err) {
        res.json({
            error: "Error Occurred while fetching user type"
        });
    }
});

export default router;
