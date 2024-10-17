document.getElementById("search-btn").addEventListener("click", async function () {
    const page = document.getElementById("page").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[month - 1];

    const fetchUrl = `/reports/${page}`;

    try {
        const response = await fetch(`${fetchUrl}?month=${month}&year=${year}`);
        const result = await response.json();

        if (result.isError) {
            alert("Error fetching data");
            return;
        }

        const tableBody = document.getElementById("table-body");

        tableBody.innerHTML = "";

        result.data.forEach(item => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = item.name;

            const marksCell = document.createElement("td");
            marksCell.textContent = item.marks;

            row.appendChild(nameCell);
            row.appendChild(marksCell);

            tableBody.appendChild(row);
        });

        const heading = document.querySelector(".heading h1");
        heading.textContent = `Showing ${page.replace(/-/g, " ")} for ${monthName} ${year}`;
    } catch (error) {
        console.error("Error fetching reports:", error);
        alert("An error occurred while fetching the reports.");
    }
});

document.getElementById("profile-btn").addEventListener("click", e => {
    window.location.href = "/admin/dashboard";
});

function logout() {
    window.location.href = "/admin/logout";
}
