const subjects = [
    "504-Python Programming TYBBA(CA)-A",
    "504-Python Programming TYBBA(CA)-B",
    "506-Python Lab TYBBA(CA)-A",
    "506-Python Lab TYBBA(CA)-B",
    "301-Digital Marketing SYBBA(CA)-A"
];

window.onload = () => {
    const lecturesTable = document.querySelector(".lectures-table");
    const container = document.createElement("div");
    container.setAttribute("id", "new-rows-container");

    subjects.forEach(subject => {
        let rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "lectures-row");

        let subjectDiv = document.createElement("div");
        subjectDiv.textContent = subject;

        let sessionInput = document.createElement("input");
        sessionInput.setAttribute("type", "number");
        sessionInput.setAttribute("placeholder", "Planned Sessions");
        sessionInput.setAttribute("class", "sessionPlanned");

        let actualSessionInput = document.createElement("input");
        actualSessionInput.setAttribute("type", "number");
        actualSessionInput.setAttribute("placeholder", "Session Conducted");
        actualSessionInput.setAttribute("class", "sessionPlanned");

        let deviationDiv = document.createElement("input");
        deviationDiv.setAttribute("type", "number");
        deviationDiv.setAttribute("value", 0);
        deviationDiv.setAttribute("class", "deviationDiv");
        deviationDiv.setAttribute("readonly", "");

        let cumulativeDiv = document.createElement("input");
        cumulativeDiv.setAttribute("type", "number");
        cumulativeDiv.setAttribute("value", 0);
        cumulativeDiv.setAttribute("class", "cumulativeDiv");
        cumulativeDiv.setAttribute("readonly", "");

        let achievementDiv = document.createElement("input");
        achievementDiv.setAttribute("type", "number");
        achievementDiv.setAttribute("value", 0);
        achievementDiv.setAttribute("class", "sessionAchievement");
        achievementDiv.setAttribute("readonly", "");

        let weightageDiv = document.createElement("input");
        weightageDiv.setAttribute("type", "number");
        weightageDiv.setAttribute("value", 0);
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

        sessionInput.addEventListener("input", updateDeviation);
        actualSessionInput.addEventListener("input", updateDeviation);

        function updateDeviation() {
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

            let weightage;
            if (achievement >= 91 && achievement <= 100) {
                weightage = 50;
            } else if (achievement >= 81 && achievement <= 90) {
                weightage = 45;
            } else if (achievement >= 71 && achievement <= 80) {
                weightage = 40;
            } else if (achievement >= 61 && achievement <= 70) {
                weightage = 35;
            } else if (achievement >= 51 && achievement <= 60) {
                weightage = 30;
            } else {
                weightage = 0;
            }
            weightageDiv.value = weightage;

            updateTotalWeightage();
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
    });

    lecturesTable.insertAdjacentElement("afterend", container);
};
