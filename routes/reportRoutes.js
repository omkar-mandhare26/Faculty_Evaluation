import { User, Subjects, noOfLectures, syllabusCompleted, classObservation, mentoringFeedback, teachingFeedback, Contribution } from "../db_schemas/schemas.js";
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

router.get("/get-full-report", adminAuthenticateToken, async (req, res) => {
    try {
        const { month, year } = req.query;
        const monthName = getMonthName(month).month;
        const allUsers = await User.find();

        const report = [];

        for (let user of allUsers) {
            let totalMarks = 0;
            let sessionConductedMarks = { sum: 0, n: 0 };
            let syllabusCompletedMarks = { sum: 0, n: 0 };
            let contributionMarks = 0;
            let mentoringFeedbackMarks = 0;
            let teachingFeedbackMarks = 0;

            const sessionConductedRecords = await noOfLectures.find({ user: user._id, month: monthName, year: year });
            const syllabusCompletedRecords = await syllabusCompleted.find({ user: user._id, month: monthName, year: year });
            const classObservationRecords = await classObservation.find({ userId: user._id, month: monthName, year: year });
            const contributionRecords = await Contribution.find({ user: user._id, month: monthName, year: year });
            const mentoringFeedbackRecords = await mentoringFeedback.find({ userId: user._id, month: monthName, year: year });
            const teachingFeedbackRecords = await teachingFeedback.find({ userId: user._id, month: monthName, year: year });

            for (let session of sessionConductedRecords) {
                sessionConductedMarks.sum += session.weightageERP;
                sessionConductedMarks.n += 1;
            }

            for (let syllabus of syllabusCompletedRecords) {
                syllabusCompletedMarks.sum += syllabus.weightageERP;
                syllabusCompletedMarks.n += 1;
            }

            const teachingLearningMarks = sessionConductedMarks.sum / sessionConductedMarks.n + syllabusCompletedMarks.sum / syllabusCompletedMarks.n;

            for (let contribution of contributionRecords) {
                contributionMarks += contribution.marks;
            }

            if (contributionMarks > 70) {
                contributionMarks = 70;
            }

            for (let mentoring of mentoringFeedbackRecords) {
                mentoringFeedbackMarks += mentoring.marks;
            }

            for (let mentoring of teachingFeedbackRecords) {
                teachingFeedbackMarks += mentoring.marks;
            }

            totalMarks = teachingLearningMarks + classObservationRecords[0].marks + contributionMarks + mentoringFeedbackMarks + teachingFeedbackMarks;
            report.push({
                name: `${user.firstName} ${user.lastName}`,
                teachingLearning: teachingLearningMarks,
                classObservation: classObservationRecords[0].marks,
                contribution: contributionMarks,
                mentoringFeedback: mentoringFeedbackMarks,
                teachingFeedback: teachingFeedbackMarks,
                totalMarks,
                outOfMarks: 215,
                percentage: Math.round((totalMarks / 215) * 100),
                grade: getGrade(Math.round((totalMarks / 215) * 100))
            });
        }

        res.status(200).json({ data: report, isError: false });
    } catch (error) {
        res.status(500).json({ isError: true, error: error.message });
    }
});

router.get("/teaching-learning", adminAuthenticateToken, async (req, res) => {
    try {
        const { month, year } = req.query;
        const monthName = getMonthName(month).month;

        const allUsers = await User.find();

        const teachingLearnings = [];

        for (let User of allUsers) {
            let sessionConductedMarks = { sum: 0, n: 0 };
            let syllabusCompletedMarks = { sum: 0, n: 0 };

            const sessionConductedRecords = await noOfLectures.find({ month: monthName, year: year, user: User._id });
            const syllabusCompletedRecords = await syllabusCompleted.find({ month: monthName, year: year, user: User._id });

            for (let session of sessionConductedRecords) {
                sessionConductedMarks.sum += session.weightageERP;
                sessionConductedMarks.n += 1;
            }

            for (let syllabus of syllabusCompletedRecords) {
                syllabusCompletedMarks.sum += syllabus.weightageERP;
                syllabusCompletedMarks.n += 1;
            }

            const totalMarks = sessionConductedMarks.sum / sessionConductedMarks.n + syllabusCompletedMarks.sum / syllabusCompletedMarks.n;
            teachingLearnings.push({
                name: `${User.firstName} ${User.lastName}`,
                marks: totalMarks
            });
        }
        res.json({ data: teachingLearnings, isError: false });
    } catch (error) {
        res.status(500).json({ isError: true, error: error.message });
    }
});

router.get("/class-observation", adminAuthenticateToken, async (req, res) => {
    try {
        const { month, year } = req.query;
        const monthName = getMonthName(month).month;
        const allUsers = await User.find();

        const classObservations = [];

        for (let user of allUsers) {
            const classObservationRecords = await classObservation.find({ userId: user._id, month: monthName, year: year });
            classObservations.push({
                name: `${user.firstName} ${user.lastName}`,
                marks: classObservationRecords[0].marks
            });
        }

        res.json({ data: classObservations, isError: false });
    } catch (error) {
        res.status(500).json({ isError: true, error: error.message });
    }
});

router.get("/research-academic-contribution", adminAuthenticateToken, async (req, res) => {
    try {
        const { month, year } = req.query;
        const monthName = getMonthName(month).month;
        const allUsers = await User.find();

        const contribution = [];

        for (let user of allUsers) {
            let contributionMarks = 0;
            const contributionRecords = await Contribution.find({ user: user._id, month: monthName, year: year });

            for (let contribution of contributionRecords) {
                contributionMarks += contribution.marks;
            }

            if (contributionMarks > 70) {
                contributionMarks = 70;
            }

            contribution.push({
                name: `${user.firstName} ${user.lastName}`,
                marks: contributionMarks
            });
        }

        res.json({ data: contribution, isError: false });
    } catch (error) {
        res.status(500).json({ isError: true, error: error.message });
    }
});

router.get("/mentoring-feedback", adminAuthenticateToken, async (req, res) => {
    try {
        const { month, year } = req.query;
        const monthName = getMonthName(month).month;
        const allUsers = await User.find();

        const mentoring = [];

        for (let user of allUsers) {
            let mentoringFeedbackMarks = 0;
            const mentoringFeedbackRecords = await mentoringFeedback.find({ userId: user._id, month: monthName, year: year });

            for (let mentoring of mentoringFeedbackRecords) {
                mentoringFeedbackMarks += mentoring.marks;
            }

            mentoring.push({
                name: `${user.firstName} ${user.lastName}`,
                marks: mentoringFeedbackMarks
            });
        }

        res.json({ data: mentoring, isError: false });
    } catch (error) {
        res.status(500).json({ isError: true, error: error.message });
    }
});

router.get("/teaching-feedback", adminAuthenticateToken, async (req, res) => {
    try {
        const { month, year } = req.query;
        const monthName = getMonthName(month).month;
        const allUsers = await User.find();

        const mentoring = [];

        for (let user of allUsers) {
            let teachingFeedbackMarks = 0;
            const mentoringFeedbackRecords = await teachingFeedback.find({ userId: user._id, month: monthName, year: year });

            for (let mentoring of mentoringFeedbackRecords) {
                teachingFeedbackMarks += mentoring.marks;
            }

            mentoring.push({
                name: `${user.firstName} ${user.lastName}`,
                marks: teachingFeedbackMarks
            });
        }

        res.json({ data: mentoring, isError: false });
    } catch (error) {
        res.status(500).json({ isError: true, error: error.message });
    }
});

export default router;

function getGrade(per) {
    if (per >= 90) {
        return "O";
    } else if (per >= 80) {
        return "A";
    } else if (per >= 70) {
        return "B";
    } else if (per >= 60) {
        return "C";
    } else if (per >= 50) {
        return "D";
    } else {
        return "F";
    }
}
