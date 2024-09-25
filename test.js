import getMonthName from "./utils/get_month_name.js";
import fs from "fs";
/*
const sessionConducted = {
    user: user._id,
    subject: subject,
    plannedSession: 0,
    sessionCompleted: 0,
    deviation: 0,
    cumulativeSyllabus: 0,
    sessionAchievement: 0,
    weightageERP: 0,
    marksAchieved: 0,
    evaluation: 0,
    remark: 0,
    month: "",
    year: year
}; */

function createObj(subjects, startMonth, endMonth, year) {
    const endingMonth = startMonth > endMonth ? 12 : endMonth;

    const data = [];
    let obj = {};
    for (const sub of subjects) {
        for (let i = startMonth; i <= endingMonth; i++) {
            obj = {
                user: "Test User",
                subject: sub,
                plannedSession: 0,
                sessionCompleted: 0,
                deviation: 0,
                cumulativeSyllabus: 0,
                sessionAchievement: 0,
                weightageERP: 0,
                marksAchieved: 0,
                evaluation: 0,
                remark: 0,
                month: getMonthName(i).month,
                year: year
            };
            data.push(obj);
            console.log(obj);
        }
        if (startMonth > endMonth) {
            for (let i = 1; i <= endMonth; i++) {
                obj = {
                    user: "Test User",
                    subject: sub,
                    plannedSession: 0,
                    sessionCompleted: 0,
                    deviation: 0,
                    cumulativeSyllabus: 0,
                    sessionAchievement: 0,
                    weightageERP: 0,
                    marksAchieved: 0,
                    evaluation: 0,
                    remark: 0,
                    month: getMonthName(i).month,
                    year: year + 1
                };
                data.push(obj);
                console.log(obj);
            }
        }
    }
    console.log(data.length);
    fs.writeFileSync("./test.json", JSON.stringify(data));
}

const subs = ["C++", "Java", "Python", "C", "JavaScript"];
const startMonth = 10;
const endMonth = 7;
const year = 2024;

createObj(subs, startMonth, endMonth, year);
