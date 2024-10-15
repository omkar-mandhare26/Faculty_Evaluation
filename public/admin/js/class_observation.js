const searchBtn = document.querySelector("#search-btn");
const submitBtn = document.getElementById("submit-btn");

let userId = "";
let month = "";
let year = "";

document.addEventListener("DOMContentLoaded", () => {
    getAllUsers();
    getUserName();
});

document.querySelector("#observation-marks").addEventListener("input", () => {
    if (document.querySelector("#observation-marks").value > 35) {
        alert("Marks cannot be greater than 35");
        document.querySelector("#observation-marks").value = 0;
    }
});

searchBtn.addEventListener("click", async () => {
    const userId = document.getElementById("user").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    document.getElementById("observation-marks").value = 0;

    try {
        const response = await fetch(`/api/admin/get-class-observations?userId=${userId}&month=${month}&year=${year}`);
        const data = await response.json();

        if (data && !data.isError) {
            const observationMarks = data.data.length > 0 ? data.data[0].marks : 0;
            document.getElementById("observation-marks").value = observationMarks;

            alert("Class observations fetched successfully!");
        } else {
            console.error("Error fetching class observations:", data);
            if (!data.error) {
                alert(`${data.message}`);
            }
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("An error occurred while fetching class observations");
    }
});

submitBtn.addEventListener("click", async e => {
    e.preventDefault();

    const observationMarks = document.getElementById("observation-marks").value;
    const userId = document.getElementById("user").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    const data = {
        userId,
        observationMarks,
        month,
        year
    };

    try {
        const response = await fetch("/api/admin/submit-class-observation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result && !result.isError) {
            alert("Class Observation submitted successfully!");
        } else {
            alert("Error submitting class observation");
        }
    } catch (error) {
        console.error("Error submitting observation:", error);
        alert("Error submitting observation");
    }
});

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
