import mongoose from "mongoose";

const teaching_feedback = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
});

const teachingFeedback = mongoose.model("teaching_feedback", teaching_feedback);
export default teachingFeedback;
