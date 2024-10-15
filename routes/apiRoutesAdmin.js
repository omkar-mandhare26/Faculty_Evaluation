import { User, Subjects, noOfLectures, syllabusCompleted, classObservation, mentoringFeedback } from "../db_schemas/schemas.js";
import { generateUserId, getMonthName, getUserType, decodeJWT } from "../utils/all_utils.js";
import { userZodSchema, syllabus_Schema } from "../zod_schemas/zod_schemas.js";
import { createHashPassword, checkPassword } from "../utils/hash_password.js";
import adminAuthenticateToken from "../middlewares/admin_auth_token.js";
import cookieParser from "cookie-parser";
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

const router = Router();
dotenv.config();
router.use(cookieParser());

router.get("/get-all-users", adminAuthenticateToken, async (req, res) => {
    try {
        const user = await User.find();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const users = user.map(user => ({
            userId: user.userId,
            username: `${user.firstName} ${user.lastName}`
        }));

        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error occurred while fetching users" });
    }
});

router.get("/search-session-records", adminAuthenticateToken, async (req, res) => {
    const { userId, month, year } = req.query;

    try {
        const user = await User.findOne({ userId: userId });
        const subjects = await Subjects.find({ user: user._id }).select("subject");

        if (!subjects || subjects.length === 0) {
            res.status(404).json({
                message: "Subjects not found",
                isError: true
            });
        }

        const sessionRecords = await noOfLectures.find({ user: user._id, month: getMonthName(month).month, year });

        if (!sessionRecords || sessionRecords.length === 0) {
            return res.status(404).json({
                message: "Session Records not found",
                isError: true
            });
        }

        res.json({ records: sessionRecords, isError: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, error: error.message });
    }
});

router.post("/update-session-conducted-records", adminAuthenticateToken, async (req, res) => {
    const { userId, marksAchieved, evaluation, remark, month, year } = req.body;

    try {
        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ isError: true, message: "User not found" });
        }

        const sessionRecords = await noOfLectures.find({ user: user._id, month: getMonthName(month).month, year });

        if (!sessionRecords || sessionRecords.length === 0) {
            return res.status(404).json({
                isError: true,
                message: "Session Records not found"
            });
        }

        const updatedSessionRecords = await noOfLectures.updateMany(
            { user: user._id, month: getMonthName(month).month, year },
            {
                $set: {
                    marksAchieved,
                    evaluation,
                    remark
                }
            }
        );

        if (!updatedSessionRecords || updatedSessionRecords.length === 0) {
            return res.status(404).json({
                isError: true,
                message: "Session Records not updated"
            });
        }

        res.status(200).json({ message: "Session Records updated successfully", isError: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, error: error.message });
    }
});

router.get("/search-syllabus-records", adminAuthenticateToken, async (req, res) => {
    const { userId, month, year } = req.query;

    try {
        const user = await User.findOne({ userId: userId });
        const subjects = await Subjects.find({ user: user._id }).select("subject");

        if (!subjects || subjects.length === 0) {
            res.status(404).json({
                message: "Subjects not found",
                isError: true
            });
        }

        const syllabusRecords = await syllabusCompleted.find({ user: user._id, month: getMonthName(month).month, year });

        if (!syllabusRecords || syllabusRecords.length === 0) {
            return res.status(404).json({
                message: "Session Records not found",
                isError: true
            });
        }

        res.json({ records: syllabusRecords, isError: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, error: error.message });
    }
});

router.post("/update-syllabus-records", adminAuthenticateToken, async (req, res) => {
    const { userId, marksAchieved, evaluation, remark, month, year } = req.body;

    try {
        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ isError: true, message: "User not found" });
        }

        const syllabusRecords = await syllabusCompleted.find({ user: user._id, month: getMonthName(month).month, year });

        if (!syllabusRecords || syllabusRecords.length === 0) {
            return res.status(404).json({
                isError: true,
                message: "Session Records not found"
            });
        }

        const updatedSessionRecords = await syllabusCompleted.updateMany(
            { user: user._id, month: getMonthName(month).month, year },
            {
                $set: {
                    marksAchieved,
                    evaluation,
                    remark
                }
            }
        );

        if (!updatedSessionRecords || updatedSessionRecords.length === 0) {
            return res.status(404).json({
                isError: true,
                message: "Session Records not updated"
            });
        }

        res.status(200).json({ message: "Session Records updated successfully", isError: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, error: error.message });
    }
});

router.get("/get-class-observations", adminAuthenticateToken, async (req, res) => {
    const { userId, month, year } = req.query;

    try {
        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                isError: true
            });
        }

        const classObservations = await classObservation.find({ userId: user._id, month: getMonthName(month).month, year });
        if (!classObservations || classObservations.length === 0) {
            return res.status(413).json({
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

router.post("/submit-class-observation", adminAuthenticateToken, async (req, res) => {
    const { userId, observationMarks, month, year } = req.body;

    try {
        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ isError: true, message: "User not found" });
        }

        const existingObservation = await classObservation.findOne({
            userId: user._id,
            month: getMonthName(month).month,
            year
        });

        if (existingObservation) {
            existingObservation.marks = observationMarks;
            await existingObservation.save();
            return res.status(200).json({ isError: false, message: "Class observation updated successfully" });
        } else {
            const newObservation = {
                userId: user._id,
                marks: observationMarks,
                month: getMonthName(month).month,
                year
            };

            await classObservation.create(newObservation);
            return res.status(201).json({ isError: false, message: "Class observation created successfully" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ isError: true, error: error.message });
    }
});

router.get("/get-mentoring-feedback", adminAuthenticateToken, async (req, res) => {
    const { userId, month, year } = req.query;

    try {
        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                isError: true
            });
        }

        const mentoringFeedbackRecords = await mentoringFeedback.find({ userId: user._id, month: getMonthName(month).month, year });
        if (!mentoringFeedbackRecords || mentoringFeedbackRecords.length === 0) {
            return res.status(413).json({
                data: null,
                message: "Mentoring Feedback Score not found",
                isError: true
            });
        }

        res.json({ data: mentoringFeedbackRecords, isError: false });
    } catch (error) {
        res.status(500).json({ isError: true, error: error.message });
    }
});

router.post("/submit-mentoring-feedback", adminAuthenticateToken, async (req, res) => {
    const { userId, observationMarks, month, year } = req.body;

    try {
        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ isError: true, message: "User not found" });
        }

        const existingObservation = await mentoringFeedback.findOne({
            userId: user._id,
            month: getMonthName(month).month,
            year
        });

        if (existingObservation) {
            existingObservation.marks = observationMarks;
            await existingObservation.save();
            return res.status(200).json({ isError: false, message: "Class observation updated successfully" });
        } else {
            const newObservation = {
                userId: user._id,
                marks: observationMarks,
                month: getMonthName(month).month,
                year
            };

            await mentoringFeedback.create(newObservation);
            return res.status(201).json({ isError: false, message: "Class observation created successfully" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ isError: true, error: error.message });
    }
});

router.get("/decoded-jwt", (req, res) => {
    const decoded = decodeJWT(req);
    if (decoded.err)
        res.status(401).json({
            error: decoded.err
        });
    else res.status(200).json(decoded);
});

export default router;
