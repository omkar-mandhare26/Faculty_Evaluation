const searchBtn = document.querySelector("#search-btn");
const submitBtn = document.getElementById("submit-btn");

let userId = "";
let month = "";
let year = "";

document.addEventListener("DOMContentLoaded", () => {
    getAllUsers();
    getUserName();

    document.querySelector("#selected-page").style = "background-color: #007bff; color: white;";
});

searchBtn.addEventListener("click", async () => {
    userId = document.getElementById("user").value;
    month = document.getElementById("month").value;
    year = document.getElementById("year").value;

    try {
        const response = await fetch(`/api/admin/search-syllabus-records?userId=${userId}&month=${month}&year=${year}`);
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

// submitBtn.addEventListener("click", async e => {
//     e.preventDefault();
//     const userType = await getUserType();
//     sendSessionConductedData();
// });

function gatherDataForSubmission() {
    const marksAchieved = document.getElementById("marks-achieved").value;
    const evaluation = document.getElementById("evaluation").value;
    const remark = document.getElementById("remark").value;

    // const data = {
    return {
        userId,
        marksAchieved,
        evaluation,
        remark,
        month,
        year
    };
}

function sendSessionConductedData() {
    const data = gatherDataForSubmission();

    fetch("/api/admin/update-syllabus-conducted-records", {
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
        sessionInput.setAttribute("readonly", "");

        let actualSessionInput = document.createElement("input");
        actualSessionInput.setAttribute("type", "number");
        actualSessionInput.setAttribute("value", session.sessionCompleted);
        actualSessionInput.setAttribute("class", "sessionCompleted");
        actualSessionInput.setAttribute("readonly", "");

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

        container.appendChild(rowDiv);
    });

    lecturesTable.insertAdjacentElement("afterend", container);

    if (sessionData[0].marksAchieved) {
        document.querySelector("#marks-achieved").value = sessionData[0].marksAchieved;
    } else {
        document.querySelector("#marks-achieved").value = 0;
    }

    if (sessionData[0].evaluation) {
        document.querySelector("#evaluation").value = sessionData[0].evaluation;
    } else {
        document.querySelector("#evaluation").value = "";
    }

    if (sessionData[0].remark) {
        document.querySelector("#remark").value = sessionData[0].remark;
    } else {
        document.querySelector("#remark").value = "";
    }
}

async function getAllUsers() {
    const response = await fetch("/api/admin/get-all-users");
    const data = await response.json();

    if (data && !data.isError) {
        renderUsers(data.users);
    } else {
        console.error("Error fetching users:", data);
        alert("Error fetching users");
    }
}

function renderUsers(users) {
    const users_Select = document.querySelector("#user");

    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.userId;
        option.textContent = user.username;
        users_Select.appendChild(option);
    });
}

function getUserName() {
    fetch("/api/admin/decoded-jwt")
        .then(response => response.json())
        .then(data => {
            document.querySelector("#user-name").textContent = `${data.decoded.fullName}`;
        })
        .catch(error => {
            console.error("Error fetching user name:", error);
        });
}

function logout() {
    window.location.href = "/admin/logout";
}
