document.getElementById("search-btn").addEventListener("click", function () {
    const monthSelect = document.getElementById("month");
    const yearSelect = document.getElementById("year");

    const month = monthSelect.options[monthSelect.selectedIndex].text;
    const year = yearSelect.options[yearSelect.selectedIndex].value;

    fetch(`/reports/get-full-report?month=${monthSelect.value}&year=${year}`)
        .then(response => response.json())
        .then(result => {
            if (!result.isError) {
                const headingElement = document.querySelector(".heading h1");
                headingElement.textContent = `Report for ${month} ${year}`;

                const tableBody = document.getElementById("table-body");
                tableBody.innerHTML = "";

                result.data.forEach(item => {
                    const row = document.createElement("tr");

                    const nameCell = document.createElement("td");
                    nameCell.textContent = item.name;

                    const teachingLearningCell = document.createElement("td");
                    teachingLearningCell.textContent = item.teachingLearning.toFixed(2);

                    const classObservationCell = document.createElement("td");
                    classObservationCell.textContent = item.classObservation;

                    const contributionCell = document.createElement("td");
                    contributionCell.textContent = item.contribution;

                    const mentoringFeedbackCell = document.createElement("td");
                    mentoringFeedbackCell.textContent = item.mentoringFeedback;

                    const teachingFeedbackCell = document.createElement("td");
                    teachingFeedbackCell.textContent = item.teachingFeedback;

                    const totalMarksCell = document.createElement("td");
                    totalMarksCell.textContent = item.totalMarks.toFixed(2);

                    const outOfMarksCell = document.createElement("td");
                    outOfMarksCell.textContent = item.outOfMarks;

                    const percentageCell = document.createElement("td");
                    percentageCell.textContent = `${item.percentage}%`;

                    const gradeCell = document.createElement("td");
                    gradeCell.textContent = item.grade;

                    row.appendChild(nameCell);
                    row.appendChild(teachingLearningCell);
                    row.appendChild(classObservationCell);
                    row.appendChild(contributionCell);
                    row.appendChild(mentoringFeedbackCell);
                    row.appendChild(teachingFeedbackCell);
                    row.appendChild(totalMarksCell);
                    row.appendChild(outOfMarksCell);
                    row.appendChild(percentageCell);
                    row.appendChild(gradeCell);

                    tableBody.appendChild(row);
                });
            } else {
                alert("Error fetching report data");
            }
        })
        .catch(error => {
            console.error("Error fetching report:", error);
        });
});

document.getElementById("profile-btn").addEventListener("click", e => {
    window.location.href = "/admin/dashboard";
});

function logout() {
    window.location.href = "/admin/logout";
}
