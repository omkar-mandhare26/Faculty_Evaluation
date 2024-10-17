const searchBtn = document.querySelector("#search-btn");

document.addEventListener("DOMContentLoaded", () => {
    getUserName();
    document.querySelector("#selected-page").style = "background-color: #007bff; color: white;";
});

searchBtn.addEventListener("click", async () => {
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    document.getElementById("observation-marks").value = 0;

    try {
        const response = await fetch(`/api/get-mentoring-feedback?month=${month}&year=${year}`);
        const data = await response.json();

        if (data && !data.isError) {
            const observationMarks = data.data.length > 0 ? data.data[0].marks : 0;
            document.getElementById("observation-marks").value = observationMarks;

            alert("Class observations fetched successfully!");
        } else {
            console.error("Error fetching class observations:", data);
            if (!data.error) {
                alert(`${data.message}`);
                document.getElementById("observation-marks").value = "Records not found";
            }
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

function logout() {
    window.location.href = "/logout";
}
