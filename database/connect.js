import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const mongoDB_Username = process.env.mongodb_username;
const mongoDB_password = process.env.mongodb_password;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`mongodb+srv://${mongoDB_Username}:${mongoDB_password}@cluster0.kcvooo8.mongodb.net/faculty_evaluation_db`);
        console.log("Connected to MongoDB Successfully!");
        return conn;
    } catch (err) {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB;