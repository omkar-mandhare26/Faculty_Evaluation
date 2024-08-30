import cookieParser from "cookie-parser";
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { createHashPassword, checkPassword } from "../utils/hash_password.js";
import { userZodSchema } from "../zod_schemas/zod_schemas.js";
import userAuthenticateToken from "../middlewares/user_auth_token.js";
import generateUserId from "../utils/generating_user_id.js";
import { User, Subjects } from "../db_schemas/schemas.js";
import connectDB from "../database/connect.js";
// import signJWT from "../utils/login_cookies.js";

const router = Router();
connectDB();
dotenv.config();
router.use(cookieParser());

router.get("/login", (req, res) => {
    res.sendFile(path.resolve("public/html/login_user.html"));
});

router.get("/signup", (req, res) => {
    // res.sendFile("./public/html/singup.html");
    res.sendFile(path.resolve("public/html/signup_user.html"));
    // res.sendFile("signup.html", { root: path.join(__dirname, "public/html") });
});

router.get("/", userAuthenticateToken, (req, res) => {
    res.json({ msg: "Hellooo from Home Page" });
});

router.get("/add-subjects", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/html/add_subjects.html"));
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
    const { subjects } = req.body;
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret_key);
        const username = decoded.username;

        const user = await User.findOne({ userId: username });
        console.log(`User from DB: ${user}`);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        for (const subject of subjects) {
            const newSubject = {
                user: user._id,
                subject
            };
            await Subjects.create(newSubject);
        }

        res.status(200).json({
            success: true,
            message: "Subjects Added Successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error Occurred while adding subjects" });
    }
});

export default router;
