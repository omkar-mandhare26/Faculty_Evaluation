async function fetchProfileDetails() {
    try {
        const response = await fetch("/admin/view-profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if (!result.isError) {
            const data = result.data;

            document.getElementById("username").textContent = data.username;
            document.getElementById("firstName").textContent = data.firstName;
            document.getElementById("lastName").textContent = data.lastName;
            document.getElementById("contact").textContent = data.contactNo;
            document.getElementById("email").textContent = data.emailId;
            document.getElementById("level").textContent = data.level;
        } else {
            console.error("Error fetching profile details");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

document.querySelector("#logout-btn").addEventListener("click", () => {
    window.location.href = "/admin/logout";
});

window.onload = fetchProfileDetails;
