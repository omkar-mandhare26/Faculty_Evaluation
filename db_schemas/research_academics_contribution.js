import mongoose from "mongoose";

const contributionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    contribution_name: {
        type: String,
        required: true
    },
    level: {
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

const Contribution = mongoose.model("contribution", contributionSchema);
export default Contribution;
