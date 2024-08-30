import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
// import ngrok from "ngrok";
import path from "path";
import adminAuthenticateToken from "./middlewares/admin_auth_token.js";
import userAuthenticateToken from "./middlewares/user_auth_token.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(express.static(path.resolve("public")));
app.use("/", userRoutes);
// app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use(cookieParser());

app.get("/display-jwt", userAuthenticateToken, (req, res) => {
    res.sendFile(path.resolve("public/html/display_jwt.html"));
});

app.get("/:others", userAuthenticateToken, (req, res) => {
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
