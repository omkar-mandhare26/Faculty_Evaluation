document.getElementById("add-subject").addEventListener("click", () => {
    const subjectItem = document.createElement("div");
    subjectItem.className = "subject-item";

    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.name = "subject";
    newInput.placeholder = "Enter subject name";
    newInput.className = "subject-input";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-subject";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
        subjectItem.remove();
    });

    subjectItem.appendChild(newInput);
    subjectItem.appendChild(deleteButton);
    document.getElementById("subject-list").appendChild(subjectItem);
});

document.querySelectorAll(".delete-subject").forEach(button => {
    button.addEventListener("click", function () {
        button.parentElement.remove();
    });
});

document.getElementById("submit-subjects").addEventListener("click", async function () {
    const subjects = document.querySelectorAll(".subject-input");
    const subjectValues = Array.from(subjects).map(input => input.value);

    const year = document.getElementById("year").value;
    const startingMonth = document.getElementById("starting-month").value;
    const endingMonth = document.getElementById("ending-month").value;

    try {
        const response = await fetch("/users/add-subjects-to-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subjects: subjectValues,
                year: parseInt(year),
                startMonth: parseInt(startingMonth),
                endMonth: parseInt(endingMonth)
            })
        });

        if (response.ok) {
            window.location.href = "/";
        } else {
            console.error("Failed to submit subjects");
            console.log(response);
            alert("Failed to submit subjects. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
});
