const contributionLevels = document.querySelectorAll(".contribution-level");
const totalWeightage = document.getElementById("total-weightage");
const submitBtn = document.querySelector("#submit-btn");
const searchBtn = document.querySelector("#search-btn");

submitBtn.addEventListener("click", submitData);
// searchBtn.addEventListener("click", searchContributions);
getUserName();

contributionLevels.forEach(select => {
    select.addEventListener("change", function () {
        calculateTotal();
        const levelText = getLevelText(select.id);
    });
});

async function searchContributions() {
    const month = parseInt(document.getElementById("month").value);
    const year = parseInt(document.getElementById("year").value);

    try {
        const response = await fetch(`/api/get-contributions?month=${month}&year=${year}`);
        const result = await response.json();

        if (result && !result.isError && result.data) {
            const contributions = result.data;

            document.getElementById("research-paper").value = contributions.find(
                c => c.contribution_name === "Research Papers in Journals/Periodicals/Books/Chapters/Articles/Editor/Editorial Member"
            ).marks;
            document.getElementById("phd-work").value = contributions.find(c => c.contribution_name === "PHD Course Work in Process").marks;
            document.getElementById("csta-membership").value = contributions.find(c => c.contribution_name === "CSTA Membership").marks;
            document.getElementById("published-chapter").value = contributions.find(
                c => c.contribution_name === "Published chapter in Digital Economy publication"
            ).marks;
            document.getElementById("research-paper-initiated").value = contributions.find(c => c.contribution_name === "Research Paper Initiated").marks;
            document.getElementById("blog").value = contributions.find(c => c.contribution_name === "Blogging").marks;

            calculateTotal();
            alert("Contributions fetched successfully!");
        } else {
            alert("No data found for the selected month and year.");
        }
    } catch (error) {
        console.error("Error fetching contributions:", error);
        alert("Failed to fetch contributions. Please try again.");
    }
}

function submitData() {
    const month = parseInt(document.getElementById("month").value);
    const year = parseInt(document.getElementById("year").value);

    const contributionsData = [
        {
            name: "Research Papers in Journals/Periodicals/Books/Chapters/Articles/Editor/Editorial Member",
            level: getLevelText("research-paper"),
            marks: parseInt(document.getElementById("research-paper").value)
        },
        {
            name: "PHD Course Work in Process",
            level: getLevelText("phd-work"),
            marks: parseInt(document.getElementById("phd-work").value)
        },
        {
            name: "CSTA Membership",
            level: getLevelText("csta-membership"),
            marks: parseInt(document.getElementById("csta-membership").value)
        },
        {
            name: "Published chapter in Digital Economy publication",
            level: getLevelText("published-chapter"),
            marks: parseInt(document.getElementById("published-chapter").value)
        },
        {
            name: "Research Paper Initiated",
            level: getLevelText("research-paper-initiated"),
            marks: parseInt(document.getElementById("research-paper-initiated").value)
        },
        {
            name: "Blogging",
            level: getLevelText("blog"),
            marks: parseInt(document.getElementById("blog").value)
        }
    ];

    const finalObject = {
        data: contributionsData,
        month: month,
        year: year
    };

    fetch("/api/submit-contributions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(finalObject)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            alert("Data submitted successfully!");
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to submit data. Please try again.");
        });
}

function getLevelText(selectId) {
    const selectElement = document.getElementById(selectId);
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    return selectedOption.text.split(" - ")[0]; // Returns the text before ' - '
}

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
