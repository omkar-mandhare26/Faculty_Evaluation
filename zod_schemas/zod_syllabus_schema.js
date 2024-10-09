import mongoose from "mongoose";
import zod from "zod";

const syllabus_Schema = zod.object({
    user: zod.union([zod.string(), zod.instanceof(mongoose.Types.ObjectId)]),
    subject: zod.string(),
    plannedSession: zod.number(),
    sessionCompleted: zod.number(),
    deviation: zod.number(),
    cumulativeSyllabus: zod.number(),
    sessionAchievement: zod.number(),
    weightageERP: zod.number(),
    marksAchieved: zod.number(),
    evaluation: zod.string(),
    remark: zod.string(),
    month: zod.string(),
    year: zod.number()
});

export default syllabus_Schema;
