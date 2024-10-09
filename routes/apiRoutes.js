import { generateUserId, getMonthName, getUserType, decodeJWT } from "../utils/all_utils.js";
import { User, Subjects, noOfLectures, syllabusCompleted, classObservation } from "../db_schemas/schemas.js";
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

router.get("/get-decoded-jwt", (req, res) => {
    const decoded = decodeJWT(req);
    if (decoded.err)
        res.json({
            error: decoded.err
        });
    else res.json(decoded);
});

router.get("/get-user-type", userAuthenticateToken, (req, res) => {
    try {
        const userType = getUserType(req);
        if (userType.error) return res.status(404).json(userType);

        res.json(userType);
    } catch (err) {
        res.json({
            error: "Error Occurred while fetching user type"
        });
    }
});

router.post("/update-session-conducted-records", userAuthenticateToken, async (req, res) => {
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

            const numericMonth = typeof month === "number" ? String(month).padStart(2, "0") : month;

            let sessionConducted = await noOfLectures.findOne({
                user: user._id,
                subject,
                month: getMonthName(numericMonth).month,
                year
            });

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
                    month: getMonthName(numericMonth).month,
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
                sessionConducted.month = getMonthName(numericMonth).month;
                sessionConducted.year = year;
                sessionConducted.marksAchieved = marksAchieved;
                sessionConducted.evaluation = evaluation;
                sessionConducted.remark = remark;
            }

            await sessionConducted.save();
        }

        res.status(200).json({
            success: true,
            message: "Session Records Updated Successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error occurred while updating session records" });
    }
});

router.post("/update-syllabus-records", userAuthenticateToken, async (req, res) => {
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

            const numericMonth = typeof month === "number" ? String(month).padStart(2, "0") : month;

            let syllabusRecords = await syllabusCompleted.findOne({
                user: user._id,
                subject,
                month: getMonthName(numericMonth).month,
                year
            });

            if (!syllabusRecords) {
                syllabusRecords = new syllabusCompleted({
                    user: user._id,
                    subject,
                    plannedSession,
                    sessionCompleted,
                    deviation,
                    cumulativeSyllabus,
                    sessionAchievement,
                    weightageERP,
                    month: getMonthName(numericMonth).month,
                    year,
                    marksAchieved,
                    evaluation,
                    remark
                });
            } else {
                syllabusRecords.plannedSession = plannedSession;
                syllabusRecords.sessionCompleted = sessionCompleted;
                syllabusRecords.deviation = deviation;
                syllabusRecords.cumulativeSyllabus = cumulativeSyllabus;
                syllabusRecords.sessionAchievement = sessionAchievement;
                syllabusRecords.weightageERP = weightageERP;
                syllabusRecords.month = getMonthName(numericMonth).month;
                syllabusRecords.year = year;
                syllabusRecords.marksAchieved = marksAchieved;
                syllabusRecords.evaluation = evaluation;
                syllabusRecords.remark = remark;
            }

            await syllabusRecords.save();
        }

        res.status(200).json({
            success: true,
            message: "Session Records Updated Successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error occurred while updating session records" });
    }
});

router.get("/search-session-records", userAuthenticateToken, async (req, res) => {
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

        if (!sessionConductedRecords || sessionConductedRecords.length === 0) {
            return res.status(404).json({
                message: "Session Records not found",
                isError: true
            });
        }

        res.status(200).json({ records: sessionConductedRecords, isError: false });
    } catch (err) {
        res.json({ msg: "Error Occurred", error: err.message });
    }
});

router.get("/search-syllabus-records", userAuthenticateToken, async (req, res) => {
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
        const syllabusRecords = await syllabusCompleted.find({ user: user.userId, month: getMonthName(month).month, year });

        if (!syllabusRecords || syllabusRecords.length === 0) {
            return res.status(404).json({
                message: "Session Records not found",
                isError: true
            });
        }

        res.status(200).json({ records: syllabusRecords, isError: false });
    } catch (err) {
        res.json({ msg: "Error Occurred", error: err.message });
    }
});

router.get("/get-class-observations", userAuthenticateToken, async (req, res) => {
    const { month, year } = req.query;
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key);
        const username = decoded.username;

        const user = await User.findOne({ userId: username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const classObservations = await classObservation.find({ userId: user._id, month: getMonthName(month).month, year });
        if (!classObservations || classObservations.length === 0) {
            return res.status(404).json({
                data: null,
                message: "Class Observations not found",
                isError: true
            });
        }

        res.json({ data: classObservations, isError: false });
    } catch (error) {
        res.status(500).json({ isError: true, error: error.message });
    }
});

export default router;
