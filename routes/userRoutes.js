import { Router } from "express";
import connectDB from "../database/connect.js";
import User from "../db_schemas/schemas.js";
import generateUserId from "../utils/generating_user_id.js";
import userZodSchema from "../zod_schemas/zod_schemas.js"

const router = Router();
connectDB();

router.post('/signup', async (req, res) => {
    const parsedInfo = req.body;
    const newUser = {
        userId: generateUserId(),
        password: parsedInfo.password,
        firstName: parsedInfo.fname,
        lastName: parsedInfo.lname,
        contactNo: parsedInfo.contactno,
        emailId: parsedInfo.email,
        qualification: parsedInfo.qualification
    }

    try {
        userZodSchema.parse(newUser);
        console.log('Validation successful!');
        try {
            const user = await User.create(newUser);
            console.log(user);
            res.status(201).json(user);
        } catch (db_err) {
            console.log(`Database Error: ${db_err.message}`);
            res.status(500).json({ error: 'An error occurred while creating the user.' });
        }
    } catch (validationErr) {
        console.error('Validation failed:', validationErr.errors);
        res.status(400).json({ errors: validationErr.errors });
    }
});

export default router;