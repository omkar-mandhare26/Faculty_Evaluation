function addRedirectListener(cardId, route) {
    document.getElementById(cardId).addEventListener("click", function () {
        window.location.href = route;
    });
}

addRedirectListener("profile-btn", "/view-account");
addRedirectListener("logout-btn", "/logout");
