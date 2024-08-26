import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactNo: {
        type: Number,
        required: true,
        unique: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    qualification: {
        type: String,
        required: true
    }
});

const User = mongoose.model("users", userSchema);
export default User;
