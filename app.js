import express from "express";
import path from "path";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

app.get("/", (req, res) => {
    res.json({ msg: "Hellooo" });
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/html/singup.html"));
});

app.listen(3000, () => {
    console.log("Server Running");
});
