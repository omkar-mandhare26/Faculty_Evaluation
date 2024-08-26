import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.mongodb_url);
        console.log(chalk.green.bgBlack("Connected to MongoDB Successfully!"));
        return conn;
    } catch (err) {
        console.log(chalk.red.bgBlack(`Error: ${err.message}`));
        process.exit(1);
    }
};

export default connectDB;
