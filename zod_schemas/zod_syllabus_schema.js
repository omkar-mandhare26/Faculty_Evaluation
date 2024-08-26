import zod from "zod";

const syllabus_Schema = zod.object({
    user: zod.string(),
    plannedSession: zod.number(),
    sessionCompleted: zod.number(),
    deviation: zod.number(),
    cumulativeSyllabus: zod.number(),
    sessionAchievement: zod.number(),
    weightageERP: zod.number(),
    marksAchieved: zod.number(),
    evaluation: zod.number(),
    remark: zod.number(),
    month: zod.string(),
    year: zod.number()
});

export default syllabus_Schema;
