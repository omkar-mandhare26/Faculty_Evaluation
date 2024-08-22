import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import authenticateToken from "./middlewares/auth_token.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.static(path.resolve("public")));
app.use('/users', userRoutes);
app.use(cookieParser());

app.get('/signup', (req, res) => {
    // res.sendFile("./public/html/singup.html");
    res.sendFile(path.resolve("public/html/signup.html"));
    // res.sendFile("signup.html", { root: path.join(__dirname, "public/html") });
});

app.get('/login', (req, res) => {
    res.sendFile(path.resolve("public/html/login.html"));
});

app.use(authenticateToken);
app.get("/", (req, res) => {
    res.json({ msg: "Hellooo from Home Page" });
});

app.listen(PORT, () => {
    console.log(`Server Running on localhost:${PORT}/`);
});
