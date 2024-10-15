import { User, Admin, Subjects, noOfLectures, syllabusCompleted } from "../db_schemas/schemas.js";
import { generateUserId, getMonthName, getUserType, decodeJWT } from "../utils/all_utils.js";
import { createHashPassword, checkPassword } from "../utils/hash_password.js";
import adminAuthenticateToken from "../middlewares/admin_auth_token.js";
import { adminZodSchema } from "../zod_schemas/zod_schemas.js";
import cookieParser from "cookie-parser";
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

const router = Router();
dotenv.config();
router.use(cookieParser());

router.get("/signup", (req, res) => {
    res.sendFile(path.resolve("public/admin/html/signup_admin.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.resolve("public/admin/html/login_admin.html"));
});

router.get("/dashboard", adminAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/admin/html/dashboard.html"));
});

router.get("/session-conducted", adminAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/admin/html/session_conducted.html"));
});

router.get("/syllabus-completed", adminAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/admin/html/syllabus_completed.html"));
});

router.get("/profile", adminAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/admin/html/view_profile.html"));
});

router.get("/class-observations", adminAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/admin/html/class_observation.html"));
});

router.get("/mentoring-feedback-score", adminAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/admin/html/mentoring_feedback.html"));
});

router.get("/teaching-feedback", adminAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/admin/html/teaching_feedback.html"));
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
                    type: "admin",
                    fullName: user.firstName + " " + user.lastName
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

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Admin.findOne({ userId: username });

        if (!user) {
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
                type: "admin",
                fullName: user.firstName + " " + user.lastName
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

router.get("/view-profile", adminAuthenticateToken, async (req, res) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key);
        const username = decoded.username;

        const user = await Admin.findOne({ userId: username });
        const data = {
            username: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            contactNo: user.contactNo,
            emailId: user.emailId,
            level: user.level
        };

        res.status(200).json({ data, isError: false });
    } catch (err) {
        res.status(500).json({ isError: true, message: "Error while fetching user" });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict"
    });
    res.redirect("/admin/login");
});

export default router;
