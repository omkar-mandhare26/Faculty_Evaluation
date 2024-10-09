import mongoose from "mongoose";

const noOfLecturesSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    subject: String,
    plannedSession: Number,
    sessionCompleted: Number,
    deviation: Number,
    cumulativeSyllabus: Number,
    sessionAchievement: Number,
    weightageERP: Number,
    marksAchieved: Number,
    evaluation: String,
    remark: String,
    month: String,
    year: Number
});

const noOfLectures = mongoose.model("no_of_lectures", noOfLecturesSchema);
export default noOfLectures;
