document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            fname: formData.get("fname"),
            lname: formData.get("lname"),
            contactno: formData.get("contactno"),
            email: formData.get("email"),
            password: formData.get("password"),
            qualification: formData.get("qualification")
        };

        try {
            const response = await fetch("/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.href = `/add-subjects`;
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.message || "An error occurred"));
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error: " + error.message);
        }
    });
});
