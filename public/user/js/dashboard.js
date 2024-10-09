function addRedirectListener(cardId, route) {
    document.getElementById(cardId).addEventListener("click", function () {
        window.location.href = route;
    });
}

addRedirectListener("profile-btn", "/profile");
addRedirectListener("logout-btn", "/logout");
