"use strict";
const dataContainer = document.querySelector('.data-row');
const tournamentsNav = document.querySelector(".tournament-navigation > ul");
function removeChildrens(element, head = false) {
    [...element.children].forEach((child, i) => {
        if (head && i == 0)
            return;
        element.removeChild(child);
    });
}
// ------------------------ //
function getResultItem(game, team0, team1, mirror = false) {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");
    const team0Name = document.createElement("span");
    team0Name.classList.add("fs-075", "fc-normal", "fw-300");
    team0Name.innerHTML = team0.name;
    const team0Result = getResultTeamElement(game, team0, team1);
    if (mirror) {
        resultItem.append(team0Result);
        resultItem.append(team0Name);
    }
    else {
        resultItem.append(team0Name);
        resultItem.append(team0Result);
    }
    return resultItem;
}
function getResultTeamElement(game, team0, team1) {
    const teamResult = document.createElement("span");
    teamResult.classList.add("fs-075", "fc-normal", "fw-800");
    if (team0.role === game.result) {
        teamResult.innerHTML = "V";
    }
    else if (team1.role === game.result) {
        teamResult.innerHTML = "P";
    }
    else {
        teamResult.innerHTML = "E";
    }
    return teamResult;
}
function getGameInfoResult(game) {
    const [team0, team1] = game.teams;
    const infoResult = document.createElement("div");
    infoResult.classList.add("game__info-result");
    const separator = document.createElement("div");
    separator.classList.add("separator", "fs-075", "fc-normal", "fw-400");
    separator.innerHTML = "-";
    const expanded = document.createElement("div");
    expanded.classList.add("expand-button");
    const iconExpanded = document.createElement("i");
    iconExpanded.classList.add("fa-solid", "fa-chevron-down");
    expanded.append(iconExpanded);
    expanded.addEventListener("click", collapsableEvent);
    infoResult.append(getResultItem(game, team0, team1));
    infoResult.append(separator);
    infoResult.append(getResultItem(game, team1, team0, true));
    infoResult.append(expanded);
    return infoResult;
}
// ------------------------ //
function getGameInfoPlayers(game) {
    const infoPlayers = document.createElement("div");
    infoPlayers.classList.add("game__info-players");
    for (let i = 0; i < game.teams.length; i++) {
        const team = game.teams[i];
        infoPlayers.append(getPlayersList(team));
    }
    return infoPlayers;
}
function getPlayersList(team) {
    const ul = document.createElement("ul");
    for (let i = 0; i < team.players.length; i++) {
        const player = team.players[i];
        const li = document.createElement("li");
        li.classList.add("fs-050", "fc-normal", "fw-300");
        li.innerHTML = `(${i + 1}) ${player}`;
        ul.append(li);
    }
    return ul;
}
// ------------------------ //
function setGames(element, games) {
    if (games && element) {
        removeChildrens(element);
        if (Array.isArray(games)) {
            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                const gameElement = document.createElement("div");
                gameElement.classList.add("game");
                const statusElement = document.createElement("div");
                statusElement.classList.add("game__status");
                const statusInfo = document.createElement("p");
                statusInfo.classList.add("fs-050", "fc-normal", "fw-800");
                statusInfo.innerHTML = game.is_finished ? "Final" : "Programado";
                statusElement.append(statusInfo);
                const statusDate = document.createElement("p");
                statusDate.classList.add("fs-050", "fc-normal", "fw-300");
                const date = new Date(game.datetime);
                const day = date.toLocaleDateString("es-AR", {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                const hour = date.toLocaleTimeString("es-AR", {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
                statusDate.innerHTML = `${day} ${hour}`;
                statusElement.append(statusDate);
                const infoElement = document.createElement("div");
                infoElement.classList.add("game__info");
                infoElement.append(getGameInfoResult(game));
                infoElement.append(getGameInfoPlayers(game));
                gameElement.append(statusElement);
                gameElement.append(infoElement);
                element.append(gameElement);
            }
        }
    }
}
// ------------------------ //
function setTable(element, table) {
    const tableElement = element.querySelector(".table");
    if (!tableElement)
        return;
    removeChildrens(tableElement, true);
    for (let i = 0; i < table.length; i++) {
        const row = table[i];
        const rowElement = document.createElement("div");
        rowElement.classList.add("table__row", "row-player", "fc-normal", "fs-050", "fw-400");
        const keys = Object.keys(row);
        for (let j = -1; j < keys.length; j++) {
            const colElement = document.createElement("div");
            const span = document.createElement("span");
            if (j === -1) {
                span.classList.add("fw-800");
                span.innerHTML = `${i + 1}`;
            }
            else {
                const key = keys[j];
                if (j === 0 && key === "player") {
                    span.innerHTML = row[key].nickname ? row[key].nickname : "";
                }
                else {
                    if (j === 1) {
                        span.classList.add("fw-800");
                    }
                    span.innerHTML = `${row[key]}`;
                }
            }
            colElement.append(span);
            rowElement.append(colElement);
        }
        tableElement.append(rowElement);
    }
}
// ------------------------ //
function replaceData(data) {
    if (!dataContainer)
        return;
    const { tournament, games, table } = data;
    const title = dataContainer.querySelector(".data-row__title > h3");
    if (title) {
        title.innerHTML = tournament.name ? tournament.name : "";
    }
    const gameContainer = dataContainer.querySelector(".data-row__game");
    if (gameContainer)
        setGames(gameContainer, games);
    const tableContainer = dataContainer.querySelector(".data-row__table");
    if (tableContainer)
        setTable(tableContainer, table);
}
function deactivateTournamet(tournaments, tournament) {
    [...tournaments].forEach((child) => {
        if (child === tournament)
            return;
        child.dataset.status = "";
    });
}
