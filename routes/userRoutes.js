import { userZodSchema, syllabus_Schema } from "../zod_schemas/zod_schemas.js";
import { createHashPassword, checkPassword } from "../utils/hash_password.js";
import { User, Subjects, noOfLectures, syllabusCompleted } from "../db_schemas/schemas.js";
import userAuthenticateToken from "../middlewares/user_auth_token.js";
import { generateUserId, getMonthName, getUserType, decodeJWT } from "../utils/all_utils.js";
import cookieParser from "cookie-parser";
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
const router = Router();
dotenv.config();
router.use(cookieParser());

router.get("/login", (req, res) => {
    res.sendFile(path.resolve("public/html/login_user.html"));
});

router.get("/signup", (req, res) => {
    res.sendFile(path.resolve("public/html/signup_user.html"));
});

router.get("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict"
    });
    res.redirect("/login");
});

router.get("/", userAuthenticateToken, (req, res) => {
    res.json({ msg: "Hellooo from Home Page" });
});

router.get("/add-subjects", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/html/add_subjects.html"));
});

router.get("/session-conducted", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/html/session_conducted.html"));
});

router.post("/users/signup", async (req, res) => {
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
                    type: "user"
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

router.post("/users/login", async (req, res) => {
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
                type: "user"
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

router.post("/users/add-subjects-to-user", userAuthenticateToken, async (req, res) => {
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

router.get("/users/get-session-conducted-records", userAuthenticateToken, async (req, res) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    // const token = req.cookies.token || req.headers.authorization;
    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key);
        const username = decoded.username;
        const user = await User.findOne({ userId: username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const session_conducted = await noOfLectures.find({ user: user._id });

        if (!session_conducted) {
            res.redirect("/add-subjects");
            return;
        }

        res.status(200).json({ session_conducted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error Occurred while fetching Session Records" });
    }
});

router.post("/users/update-session-conducted-records", userAuthenticateToken, async (req, res) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key);
        const username = decoded.username;

        const user = await User.findOne({ userId: username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const subjects = Object.keys(req.body);

        for (let subjectKey of subjects) {
            const {
                subject,
                plannedSession,
                sessionCompleted,
                deviation,
                cumulativeSyllabus,
                sessionAchievement,
                weightageERP,
                month,
                year,
                marksAchieved,
                evaluation,
                remark
            } = req.body[subjectKey];

            let sessionConducted = await noOfLectures.findOne({ user: user._id, subject });

            if (!sessionConducted) {
                sessionConducted = new noOfLectures({
                    user: user._id,
                    subject,
                    plannedSession,
                    sessionCompleted,
                    deviation,
                    cumulativeSyllabus,
                    sessionAchievement,
                    weightageERP,
                    month: getMonthName(month).month,
                    year,
                    marksAchieved,
                    evaluation,
                    remark
                });
            } else {
                sessionConducted.plannedSession = plannedSession;
                sessionConducted.sessionCompleted = sessionCompleted;
                sessionConducted.deviation = deviation;
                sessionConducted.cumulativeSyllabus = cumulativeSyllabus;
                sessionConducted.sessionAchievement = sessionAchievement;
                sessionConducted.weightageERP = weightageERP;
                sessionConducted.month = month;
                sessionConducted.year = year;
                sessionConducted.marksAchieved = marksAchieved;
                sessionConducted.evaluation = evaluation;
                sessionConducted.remark = remark;
            }

            await sessionConducted.save();
        }

        console.log("DB Updated 1");
        res.status(200).json({
            success: true,
            message: "Session Records Updated Successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error Occurred while updating session records" });
    }
});

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

router.post("/just-receive-data", userAuthenticateToken, (req, res) => {
    const body = req.body;
    console.log(body);
    res.json(body);
});

router.get("/users/search-session-records", userAuthenticateToken, async (req, res) => {
    const { month, year } = req.query;
    try {
        const decodedToken = decodeJWT(req);
        if (decodedToken.error) {
            return res.json({ msg: "Error decoding token" });
        }
        const user = decodedToken.decoded;
        const subjects = await Subjects.find({ user: user.userId }).select("subject");

        if (!subjects) {
            res.status(404).json({
                message: "Subjects not found",
                isError: true
            });
        }
        const sessionConductedRecords = await noOfLectures.find({ user: user.userId, month: getMonthName(month).month, year });

        if (!sessionConductedRecords) {
            res.status(404).json({
                message: "Session Records not found",
                isError: true
            });
        }

        res.status(200).json({ records: sessionConductedRecords, isError: false });
    } catch (err) {
        res.json({ msg: "Error Occurred", error: err.message });
    }
});

export default router;
