import { generateUserId, getMonthName, getUserType, decodeJWT } from "../utils/all_utils.js";
import { User, Subjects, noOfLectures, syllabusCompleted } from "../db_schemas/schemas.js";
import { userZodSchema, syllabus_Schema } from "../zod_schemas/zod_schemas.js";
import { createHashPassword, checkPassword } from "../utils/hash_password.js";
import adminAuthenticateToken from "../middlewares/admin_auth_token.js";
import cookieParser from "cookie-parser";
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

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

router.get("/decoded-jwt", (req, res) => {
    const decoded = decodeJWT(req);
    if (decoded.err)
        res.status(401).json({
            error: decoded.err
        });
    else res.status(200).json(decoded);
});

export default router;
