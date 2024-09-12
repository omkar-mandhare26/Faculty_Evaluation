import { createHashPassword, checkPassword } from "../utils/hash_password.js";
import adminAuthenticateToken from "../middlewares/admin_auth_token.js";
import { adminZodSchema } from "../zod_schemas/zod_schemas.js";
import generateUserId from "../utils/generating_user_id.js";
import getUserType from "../utils/get_user_type.js";
import { Admin } from "../db_schemas/schemas.js";
import cookieParser from "cookie-parser";
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

const router = Router();
dotenv.config();
router.use(cookieParser());

router.get("/signup", (req, res) => {
    res.sendFile(path.resolve("public/html/signup_admin.html"));
});

router.get("/test", (req, res) => {
    res.json({ msg: "Hello" });
});

router.post("/signup", async (req, res) => {
    const parsedInfo = req.body;
    const hashedPW = await createHashPassword(parsedInfo.password);
    const newUser = {
        userId: generateUserId(),
        password: hashedPW,
        firstName: parsedInfo.fname,
        lastName: parsedInfo.lname,
        contactNo: parsedInfo.contactno,
        emailId: parsedInfo.email,
        level: parsedInfo.level
    };

    try {
        adminZodSchema.parse(newUser);
        console.log("Validation successful!");
        try {
            const user = await Admin.create(newUser);
            console.log(user);

            const token = jwt.sign(
                {
                    userId: user._id,
                    username: user.userId,
                    type: "admin"
                },
                process.env.jwt_secret_key,
                { expiresIn: "1h" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });

            res.status(201).json({
                message: "Signup successful",
                userID: newUser.userId
            });
        } catch (db_err) {
            console.log(`Database Error: ${db_err.message}`);
            res.status(500).json({
                error: "An error occurred while creating the user."
            });
        }
    } catch (validationErr) {
        console.error("Validation failed:", validationErr.errors);
        res.status(400).json({ errors: validationErr.errors });
    }
});

router.get("/login", (req, res) => {
    res.sendFile(path.resolve("public/html/login_admin.html"));
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Admin.findOne({ userId: username });

        if (!user) {
            z;
            return res.status(404).json({ message: "Admin not found" });
        }
        const match = await checkPassword(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Wrong Credentials" });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.userId,
                type: "admin"
            },
            process.env.jwt_secret_key,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });

        return res.json({
            success: true,
            message: "Login Success",
            userid: user._id,
            token
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/get-user-type", adminAuthenticateToken, (req, res) => {
    const userType = getUserType(req);
    res.json(userType);
});

router.get("/dashboard", adminAuthenticateToken, (req, res) => {
    res.json({ message: "Wait kro admin" });
});

export default router;
