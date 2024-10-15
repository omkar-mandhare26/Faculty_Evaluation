import mongoose from "mongoose";

const mentoring_feedback = mongoose.Schema({
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

const mentoringFeedback = mongoose.model("mentoring_feedback", mentoring_feedback);
export default mentoringFeedback;
