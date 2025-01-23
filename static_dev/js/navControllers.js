"use strict";
const hambugerElement = document.querySelector(".hamburger");
const tournamentNavigationElement = document.querySelector(".tournament-navigation");
hambugerElement === null || hambugerElement === void 0 ? void 0 : hambugerElement.addEventListener("click", (e) => {
    var _a;
    let element = e.target;
    if (!element.childElementCount) {
        element = element.parentElement;
    }
    const currentStatus = (_a = element.dataset.status) !== null && _a !== void 0 ? _a : "";
    const newStatus = currentStatus === "active" ? "" : "active";
    if (element) {
        element.dataset.status = newStatus;
    }
    if (tournamentNavigationElement) {
        tournamentNavigationElement.dataset.status = newStatus;
    }
});
