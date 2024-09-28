import { generateUserId, getMonthName, getUserType, decodeJWT } from "../utils/all_utils.js";
import { User, Subjects, noOfLectures, syllabusCompleted } from "../db_schemas/schemas.js";
import { userZodSchema, syllabus_Schema } from "../zod_schemas/zod_schemas.js";
import { createHashPassword, checkPassword } from "../utils/hash_password.js";
import userAuthenticateToken from "../middlewares/user_auth_token.js";
import cookieParser from "cookie-parser";
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const router = Router();
dotenv.config();
router.use(cookieParser());

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
        qualification: parsedInfo.qualification
    };

    try {
        userZodSchema.parse(newUser);
        console.log("Validation successful!");
        try {
            const user = await User.create(newUser);
            console.log(user);

            const token = jwt.sign(
                {
                    userId: user._id,
                    username: user.userId,
                    type: "user",
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
        const user = await User.findOne({ userId: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const match = await checkPassword(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Wrong Credentials" });
        }
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.userId,
                type: "user",
                fullName: user.firstName + " " + user.lastName
            },
            process.env.jwt_secret_key,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: false,
            secure: true,
            sameSite: "strict"
        });

        return res.json({
            success: true,
            message: "Login Success",
            userid: user._id,
            token
        });
        console.log("Login Success");
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/add-subjects-to-user", userAuthenticateToken, async (req, res) => {
    const { subjects, startMonth, endMonth, year } = req.body;

    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key);
        const username = decoded.username;

        const user = await User.findOne({ userId: username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const sessionConductedData = [];
        // const syllabusCompletedData = [];
        const endingMonth = startMonth > endMonth ? 12 : endMonth;
        let obj = {};

        for (const subject of subjects) {
            const newSubject = {
                user: user._id,
                subject,
                year,
                startMonth,
                endMonth
            };
            await Subjects.create(newSubject);

            for (let i = startMonth; i <= endingMonth; i++) {
                obj = {
                    user: user._id,
                    subject: subject,
                    plannedSession: 0,
                    sessionCompleted: 0,
                    deviation: 0,
                    cumulativeSyllabus: 0,
                    sessionAchievement: 0,
                    weightageERP: 0,
                    marksAchieved: 0,
                    evaluation: 0,
                    remark: 0,
                    month: getMonthName(i).month,
                    year: year
                };
                sessionConductedData.push(obj);
            }
            if (startMonth > endMonth) {
                for (let i = 1; i <= endMonth; i++) {
                    obj = {
                        user: user._id,
                        subject: subject,
                        plannedSession: 0,
                        sessionCompleted: 0,
                        deviation: 0,
                        cumulativeSyllabus: 0,
                        sessionAchievement: 0,
                        weightageERP: 0,
                        marksAchieved: 0,
                        evaluation: 0,
                        remark: 0,
                        month: getMonthName(i).month,
                        year: year + 1
                    };
                    sessionConductedData.push(obj);
                }
            }
        }
        try {
            sessionConductedData.forEach(obj => syllabus_Schema.parse(obj));
        } catch (error) {
            console.error("Zod Validation Error:", error.errors);
            throw error;
        }
        await noOfLectures.insertMany(sessionConductedData);
        await syllabusCompleted.insertMany(sessionConductedData);
        fs.writeFileSync("./test.json", JSON.stringify(sessionConductedData));
        res.status(200).json({
            success: true,
            message: "Subjects Added Successfully",
            receivedInput: { subjects, year, startMonth, endMonth }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error Occurred while adding subjects", errorMessage: error.message });
    }
});

export default router;
