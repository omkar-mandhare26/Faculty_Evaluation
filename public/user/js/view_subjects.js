async function fetchSubjects() {
    try {
        const response = await fetch("/user/get-all-subjects");
        const result = await response.json();

        if (!result.isError) {
            const { firstName, lastName, subjects } = result.data;

            document.getElementById("name").textContent = `${firstName} ${lastName}`;

            const subjectList = document.getElementById("subject-list");
            subjects.forEach(subject => {
                const row = document.createElement("tr");
                row.innerHTML = `
                                <td>${subject.subject}</td>
                                <td>${subject.startMonth}</td>
                                <td>${subject.endMonth}</td>
                                <td>${subject.year}</td>
                            `;
                subjectList.appendChild(row);
            });
        } else {
            console.error("Error fetching subjects");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

document.getElementById("profile-btn").addEventListener("click", e => {
    window.location.href = "/dashboard";
});

document.getElementById("logout-btn").addEventListener("click", e => {
    window.location.href = "/logout";
});

window.onload = fetchSubjects;
