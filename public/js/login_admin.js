document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password }),
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = "/admin/dashboard";
            } else {
                alert("Login failed: " + data.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred while trying to log in.");
        }
    });
});
