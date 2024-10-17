import { User, Subjects, noOfLectures, syllabusCompleted, classObservation, mentoringFeedback, teachingFeedback } from "../db_schemas/schemas.js";
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

export default router;
