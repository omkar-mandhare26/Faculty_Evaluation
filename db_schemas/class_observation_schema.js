import mongoose from "mongoose";

const class_observations = mongoose.Schema({
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

const classObservation = mongoose.model("class_observation", class_observations);
export default classObservation;
