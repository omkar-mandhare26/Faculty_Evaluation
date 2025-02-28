// import adminAuthenticateToken from "./middlewares/admin_auth_token.js";
import userAuthenticateToken from "./middlewares/user_auth_token.js";
import apiRoutesAdmin from "./routes/apiRoutesAdmin.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import connectDB from "./database/connect.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import express from "express";
// import ngrok from "ngrok";
import dotenv from "dotenv";
import chalk from "chalk";
import path from "path";

const PORT = process.env.PORT || 8080;
const app = express();
await connectDB();
dotenv.config();
app.use(cookieParser());
app.use(express.static(path.resolve("public")));
app.use(express.json());
app.use("/api", apiRoutes);
app.use("/api/admin", apiRoutesAdmin);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/reports", reportRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.resolve("public/home.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.resolve("public/user/html/login.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.resolve("public/user/html/signup.html"));
});

app.get("/dashboard", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/user/html/dashboard.html"));
});

app.get("/add-subjects", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/user/html/add_subjects.html"));
});

app.get("/session-conducted", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/user/html/session_conducted.html"));
});

app.get("/syllabus-completed", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/user/html/syllabus_completed.html"));
});

app.get("/profile", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/user/html/view_profile.html"));
});

app.get("/subjects", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/user/html/view_subjects.html"));
});

app.get("/class-observations", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/user/html/class_observation.html"));
});

app.get("/mentoring-feedback-score", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/user/html/mentoring_feedback.html"));
});

app.get("/teaching-feedback", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/user/html/teaching_feedback.html"));
});

app.get("/research-academic-contribution", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/user/html/research_academics_contributions.html"));
});

app.post("/just-receive-data", userAuthenticateToken, (req, res) => {
    const body = req.body;
    console.log(body);
    res.json(body);
});

app.get("/get-decoded-jwt", (req, res) => {
    const decoded = decodeJWT(req);
    if (decoded.err)
        res.json({
            error: decoded.err
        });
    else res.json(decoded);
});

app.get("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict"
    });
    res.redirect("/login");
});

app.listen(PORT, () => {
    console.log(chalk.italic.inverse(`Server Running on http://localhost:${PORT}`));
});

// app.listen(PORT, "0.0.0.0", () => {
//     console.log(
//         chalk.italic.inverse(`Server Running on http://0.0.0.0:${PORT}`)
//     );
// });

// async () => {
//     try {
//         const url = await ngrok.connect({
//             addr: PORT,
//             authtoken: process.env.NGROK_AUTHTOKEN // Replace with your ngrok auth token
//         });
//         console.log(`Ingress established at: ${url}`);
//     } catch (error) {
//         console.error("Error establishing ngrok tunnel:", error);
//     }
// };
