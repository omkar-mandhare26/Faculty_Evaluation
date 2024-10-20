// const searchBtn = document.querySelector("#search-btn").addEventListener("click", async searchContributions);
const submitBtn = document.getElementById("submit-btn");
const contributionLevels = document.querySelectorAll(".contribution-level");
const totalWeightage = document.getElementById("total-weightage");

let userId = "";
let month = "";
let year = "";

document.addEventListener("DOMContentLoaded", () => {
    getAllUsers();
    getUserName();

    document.querySelector("#selected-page").style = "background-color: #007bff; color: white;";
});

document.querySelector("#search-btn").addEventListener("click", async () => {
    month = parseInt(document.getElementById("month").value);
    year = parseInt(document.getElementById("year").value);
    userId = document.getElementById("user").value;

    try {
        const response = await fetch(`/api/admin/get-contributions?userId=${userId}&month=${month}&year=${year}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result && !result.isError && Array.isArray(result.data)) {
            alert("Contributions fetched successfully!");
            const contributions = result.data;

            const researchPaper = contributions.find(
                c => c.contribution_name === "Research Papers in Journals/Periodicals/Books/Chapters/Articles/Editor/Editorial Member"
            );
            const phdWork = contributions.find(c => c.contribution_name === "PHD Course Work in Process");
            const cstaMembership = contributions.find(c => c.contribution_name === "CSTA Membership");
            const publishedChapter = contributions.find(c => c.contribution_name === "Published chapter in Digital Economy publication");
            const researchPaperInitiated = contributions.find(c => c.contribution_name === "Research Paper Initiated");
            const blog = contributions.find(c => c.contribution_name === "Blogging");

            document.getElementById("research-paper").value = researchPaper ? researchPaper.marks : 0;
            document.getElementById("phd-work").value = phdWork ? phdWork.marks : 0;
            document.getElementById("csta-membership").value = cstaMembership ? cstaMembership.marks : 0;
            document.getElementById("published-chapter").value = publishedChapter ? publishedChapter.marks : 0;
            document.getElementById("research-paper-initiated").value = researchPaperInitiated ? researchPaperInitiated.marks : 0;
            document.getElementById("blog").value = blog ? blog.marks : 0;

            calculateTotal();
        } else {
            alert("No data found for the selected month and year.");
        }
    } catch (error) {
        console.error("Error fetching contributions:", error);
        alert("Failed to fetch contributions. Please try again.");
    }
});

function calculateTotal() {
    let total = 0;
    contributionLevels.forEach(select => {
        total += parseInt(select.value);
    });
    if (total > 70) {
        totalWeightage.textContent = 70;
        alert("Total marks exceed 70. The maximum limit is 70.");
    } else {
        totalWeightage.textContent = total;
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
