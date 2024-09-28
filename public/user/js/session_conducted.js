document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.querySelector("#search-btn");

    const admin_eval_inputs = document.querySelectorAll(".admin-eval");
    get_User_Type()
        .then(user_type => {
            if (user_type == "user") {
                admin_eval_inputs.forEach(input => {
                    input.disabled = true;
                });
            }
        })
        .catch(error => {
            console.error("Error fetching user type:", error);
        });
});

const searchBtn = document.querySelector("#search-btn");
searchBtn.addEventListener("click", async () => {
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    try {
        const response = await fetch(`/user/search-session-records?month=${month}&year=${year}`);
        const data = await response.json();

        if (data && !data.isError) {
            renderSubjects(data.records);
        } else {
            console.error("Error fetching session records:", data);
            alert("Error fetching session records");
        }
    } catch (error) {
        console.error("Error fetching session records:", error);
    }
});

const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", async e => {
    e.preventDefault();
    const userType = await getUserType();
    sendSessionConductedData(userType);
});

async function getUserType() {
    try {
        const response = await fetch("/user/get-user-type");
        const jsonData = await response.json();
        return jsonData["type"];
    } catch (error) {
        console.error("Error fetching user type:", error);
    }
}

function gatherDataForSubmission(userType) {
    const subjectsData = {};
    const sessionRows = document.querySelectorAll(".lectures-row");
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    sessionRows.forEach((row, index) => {
        const subject = row.children[0].textContent;
        const plannedSession = parseInt(row.children[1].value) || 0;
        const sessionCompleted = parseInt(row.children[2].value) || 0;
        const deviation = parseInt(row.children[3].value) || 0;
        const cumulativeSyllabus = parseInt(row.children[4].value) || 0;
        const sessionAchievement = parseFloat(row.children[5].value) || 0;
        const weightageERP = parseFloat(row.children[6].value) || 0;

        subjectsData[`subject${index + 1}`] = {
            subject,
            plannedSession,
            sessionCompleted,
            deviation,
            cumulativeSyllabus,
            sessionAchievement,
            weightageERP,
            month,
            year,
            marksAchieved: userType === "user" ? 0 : null,
            evaluation: userType === "user" ? "" : null,
            remark: userType === "user" ? "" : null
        };
    });

    return subjectsData;
}

function sendSessionConductedData(userType) {
    const data = gatherDataForSubmission(userType);

    fetch("/user/update-session-conducted-records", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            alert("Successfully updated session records");
        })
        .catch(error => {
            console.error("Error updating session conducted records:", error);
            alert("Error updating session conducted records");
        });
}

function renderSubjects(sessionData) {
    const lecturesTable = document.querySelector(".lectures-table");

    const existingRows = document.getElementById("new-rows-container");
    if (existingRows) existingRows.remove();

    const container = document.createElement("div");
    container.setAttribute("id", "new-rows-container");

    sessionData.forEach(session => {
        let rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "lectures-row");

        let subjectDiv = document.createElement("div");
        subjectDiv.textContent = session.subject;

        let sessionInput = document.createElement("input");
        sessionInput.setAttribute("type", "number");
        sessionInput.setAttribute("value", session.plannedSession);
        sessionInput.setAttribute("class", "sessionPlanned");

        let actualSessionInput = document.createElement("input");
        actualSessionInput.setAttribute("type", "number");
        actualSessionInput.setAttribute("value", session.sessionCompleted);
        actualSessionInput.setAttribute("class", "sessionCompleted");

        let deviationDiv = document.createElement("input");
        deviationDiv.setAttribute("type", "number");
        deviationDiv.setAttribute("value", session.plannedSession - session.sessionCompleted);
        deviationDiv.setAttribute("class", "deviationDiv");
        deviationDiv.setAttribute("readonly", "");

        let cumulativeDiv = document.createElement("input");
        cumulativeDiv.setAttribute("type", "number");
        cumulativeDiv.setAttribute("value", session.cumulativeSyllabus);
        cumulativeDiv.setAttribute("class", "cumulativeDiv");
        cumulativeDiv.setAttribute("readonly", "");

        let achievementDiv = document.createElement("input");
        achievementDiv.setAttribute("type", "number");
        achievementDiv.setAttribute("value", session.sessionAchievement);
        achievementDiv.setAttribute("class", "sessionAchievement");
        achievementDiv.setAttribute("readonly", "");

        let weightageDiv = document.createElement("input");
        weightageDiv.setAttribute("type", "number");
        weightageDiv.setAttribute("value", session.weightageERP);
        weightageDiv.setAttribute("class", "weitageERP");
        weightageDiv.setAttribute("readonly", "");

        rowDiv.appendChild(subjectDiv);
        rowDiv.appendChild(sessionInput);
        rowDiv.appendChild(actualSessionInput);
        rowDiv.appendChild(deviationDiv);
        rowDiv.appendChild(cumulativeDiv);
        rowDiv.appendChild(achievementDiv);
        rowDiv.appendChild(weightageDiv);

        sessionInput.addEventListener("input", () =>
            updateDeviation(sessionInput, actualSessionInput, deviationDiv, cumulativeDiv, achievementDiv, weightageDiv)
        );
        actualSessionInput.addEventListener("input", () =>
            updateDeviation(sessionInput, actualSessionInput, deviationDiv, cumulativeDiv, achievementDiv, weightageDiv)
        );

        container.appendChild(rowDiv);
    });

    lecturesTable.insertAdjacentElement("afterend", container);
    updateTotalWeightage();
}

function updateDeviation(sessionInput, actualSessionInput, deviationDiv, cumulativeDiv, achievementDiv, weightageDiv) {
    const plannedSessions = parseInt(sessionInput.value) || 0;
    const actualSessions = parseInt(actualSessionInput.value) || 0;

    const deviation = plannedSessions - actualSessions;
    deviationDiv.value = deviation;

    cumulativeDiv.value = Math.floor((actualSessions * 100) / 52);

    let achievement = ((actualSessions * 100) / plannedSessions).toFixed(2);
    if (achievement >= 100) {
        achievement = 100;
    }
    achievementDiv.value = achievement;

    weightageDiv.value = getWeightage(achievement);

    updateTotalWeightage();
}

function getWeightage(achievement) {
    if (achievement >= 91 && achievement <= 100) return 50;
    if (achievement >= 81 && achievement <= 90) return 45;
    if (achievement >= 71 && achievement <= 80) return 40;
    if (achievement >= 61 && achievement <= 70) return 35;
    if (achievement >= 51 && achievement <= 60) return 30;
    return 0;
}

function updateTotalWeightage() {
    const weightageDivs = document.querySelectorAll(".weitageERP");
    let totalWeightage = 0;
    let count = weightageDivs.length;

    weightageDivs.forEach(div => {
        totalWeightage += parseFloat(div.value) || 0;
    });

    const averageWeightage = totalWeightage / count;

    const totalWeightageElement = document.getElementById("total-weightage");
    if (totalWeightageElement) {
        totalWeightageElement.textContent = averageWeightage.toFixed(2);
    }
}

async function get_User_Type() {
    const rowData = await fetch("/user/get-user-type");
    const jsonData = await rowData.json();
    return jsonData["type"];
}

function logout() {
    window.location.href = "/logout";
}
