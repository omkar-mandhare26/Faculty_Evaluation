import mongoose from "mongoose";

const subjectSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    startMonth: {
        type: String,
        required: true
    },
    endMonth: {
        type: String,
        required: true
    }
});

const Subjects = mongoose.model("subjects", subjectSchema);
export default Subjects;
