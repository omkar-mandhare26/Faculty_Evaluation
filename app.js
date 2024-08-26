import express from "express";
import ngrok from "ngrok";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import chalk from "chalk";
import userRoutes from "./routes/userRoutes.js";
import authenticateToken from "./middlewares/auth_token.js";
import jwt from "jsonwebtoken";

dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(express.static(path.resolve("public")));
app.use("/users", userRoutes);
app.use(cookieParser());

app.get("/login", (req, res) => {
    res.sendFile(path.resolve("public/html/login.html"));
});

app.get("/signup", (req, res) => {
    // res.sendFile("./public/html/singup.html");
    res.sendFile(path.resolve("public/html/signup.html"));
    // res.sendFile("signup.html", { root: path.join(__dirname, "public/html") });
});

app.use(authenticateToken);
app.get("/", (req, res) => {
    res.json({ msg: "Hellooo from Home Page" });
});

app.get("/add-subjects", (req, res) => {
    res.sendFile(path.resolve("public/html/add_subjects.html"));
});

app.get("/:others", (req, res) => {
    res.json({ msg: "Wait Kro" });
});

app.listen(PORT, () => {
    console.log(chalk.italic.inverse(`Server Running on http://localhost:${PORT}`));
});

// app.listen(PORT, "0.0.0.0", () => {
//     console.log(
//         chalk.italic.inverse(`Server Running on http://0.0.0.0:${PORT}`)
//     );
// });

async () => {
    try {
        const url = await ngrok.connect({
            addr: PORT,
            authtoken: process.env.NGROK_AUTHTOKEN // Replace with your ngrok auth token
        });
        console.log(`Ingress established at: ${url}`);
    } catch (error) {
        console.error("Error establishing ngrok tunnel:", error);
    }
};
