"use strict";
const infoTitle = document.querySelectorAll(".title-row > h2");
const sections = document.querySelectorAll("[section]");
const toggleButtons = document.querySelectorAll(".expand-button");
function toggleSectionStatus(element) {
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section.dataset.type === element.dataset.type) {
            section.dataset.status = element.dataset.status;
        }
        else {
            section.dataset.status = "";
        }
    }
    ;
}
;
infoTitle.forEach((element) => {
    element.addEventListener("click", (e) => {
        element.dataset.status = "active";
        const parent = element.parentElement;
        if (parent) {
            const children = Array.from(parent.children);
            children.forEach((child) => {
                if (child === element)
                    return;
                child.dataset.status = "";
            });
        }
        toggleSectionStatus(element);
    });
});
function collapsableEvent(e) {
    var _a, _b, _c, _d;
    const chevron = e.target;
    let topParent;
    if (chevron.localName === "i") {
        topParent = (_b = (_a = chevron.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
    }
    else if (chevron.localName === "div")
        topParent = (_c = chevron.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement;
    if (!topParent)
        return;
    const currentStatus = (_d = topParent.dataset.status) !== null && _d !== void 0 ? _d : "";
    const newStatus = currentStatus === "active" ? "" : "active";
    topParent.dataset.status = newStatus;
    const players = topParent.querySelector(".game__info-players");
    if (!players)
        return;
    const prop = "--max-height";
    const scrollHeigth = players.children[0].scrollHeight;
    if (players.style.getPropertyValue(prop)) {
        players.style.removeProperty(prop);
    }
    else {
        players.style.setProperty(prop, `${scrollHeigth}px`);
    }
}
toggleButtons.forEach((button) => {
    button.addEventListener("click", collapsableEvent);
});
