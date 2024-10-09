document.addEventListener("DOMContentLoaded", () => {
    getUserName();
    document.querySelector("#selected-page").style = "background-color: #007bff; color: white;";
    document.querySelector(".admin-eval").disabled = true;
});

document.querySelector("#search-btn").addEventListener("click", async () => {
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    document.getElementById("observation-marks").value = 0;

    try {
        const response = await fetch(`/api/get-class-observations?month=${month}&year=${year}`);
        const data = await response.json();

        if (data && !data.isError) {
            const observationMarks = data.data.length > 0 ? data.data[0].marks : 0;
            document.getElementById("observation-marks").value = observationMarks;

            alert("Class observations fetched successfully!");
        } else {
            console.error("Error fetching class observations:", data);
            alert("Error fetching class observations");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("An error occurred while fetching class observations");
    }
});

function getUserName() {
    fetch("/user/decoded-jwt")
        .then(response => response.json())
        .then(data => {
            document.querySelector("#user-name").textContent = `${data.decoded.fullName}`;
        })
        .catch(error => {
            console.error("Error fetching user name:", error);
        });
}
