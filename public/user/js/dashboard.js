function addRedirectListener(cardId, route) {
    document.getElementById(cardId).addEventListener("click", function () {
        window.location.href = route;
    });
}

addRedirectListener("view-account", "/view-account");
addRedirectListener("view-subjects", "/view-subjects");
addRedirectListener("add-subjects", "/add-subjects");
addRedirectListener("session-conducted", "/session-conducted");
addRedirectListener("syllabus-completed", "/syllabus-completed");
addRedirectListener("class-observations", "/class-observations");
addRedirectListener("central-committee", "/central-committee");
addRedirectListener("unit-level-committee", "/unit-level-committee");
addRedirectListener("research-contributions", "/research-academic-contribution");
addRedirectListener("mentoring-feedback", "/mentoring-feedback-score");
addRedirectListener("teaching-feedback", "/teaching-feedback");

addRedirectListener("profile-btn", "/view-account");
addRedirectListener("logout-btn", "/logout");
