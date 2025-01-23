type Player = { 
    id: number;
    first_name: string | null;
    last_name: string | null;
    nickname: string | null;
}


type Team = {
    name: string;
    role: "L" | "T";
    players: Omit<Player, "id" | "first_name" | "last_name">[];
}

type Game = {
    datetime: string;
    result: string | null;
    is_finished: boolean;
    bonus: boolean;
    teams: Team[];
}

type Table = {
    player: Player;
    total_points: number;
    games_played: number;
    games_won: number;
    games_lost: number;
    games_tie: number;
    games_with_bonus: number;
}

const dataContainer: HTMLElement | null = document.querySelector('.data-row')
const tournamentsNav: HTMLElement | null = document.querySelector(".tournament-navigation > ul")

function removeChildrens(element: HTMLElement, head:boolean = false): void {
    [...element.children].forEach((child, i) => {
        if (head && i == 0) return
        element.removeChild(child)
    })
}
// ------------------------ //
function getResultItem(game: Game, team0: Team, team1: Team, mirror:boolean = false): HTMLElement {
    const resultItem: HTMLElement = document.createElement("div")
    resultItem.classList.add("result-item")
    const team0Name: HTMLElement = document.createElement("span")
    team0Name.classList.add("fs-075", "fc-normal", "fw-300")
    team0Name.innerHTML = team0.name
    const team0Result: HTMLElement = getResultTeamElement(game, team0, team1)
    if (mirror) {
        resultItem.append(team0Result)
        resultItem.append(team0Name)
    } else {
        resultItem.append(team0Name)
        resultItem.append(team0Result)
    }
    return resultItem
}

function getResultTeamElement(game: Game, team0: Team, team1: Team): HTMLElement {
    const teamResult: HTMLElement = document.createElement("span")
    teamResult.classList.add("fs-075", "fc-normal", "fw-800")
    if (team0.role === game.result) {
        teamResult.innerHTML = "V" 
    } else if (team1.role === game.result){
        teamResult.innerHTML = "P" 
    } else {
    teamResult.innerHTML = "E"
    }
    return teamResult
}

function getGameInfoResult(game: Game): HTMLElement {
    const [team0, team1] = game.teams

    const infoResult: HTMLElement = document.createElement("div")
    infoResult.classList.add("game__info-result")


    const separator: HTMLElement = document.createElement("div")
    separator.classList.add("separator", "fs-075", "fc-normal", "fw-400")
    separator.innerHTML = "-"

    const expanded: HTMLElement = document.createElement("div")
    expanded.classList.add("expand-button")
    const iconExpanded: HTMLElement = document.createElement("i")
    iconExpanded.classList.add("fa-solid", "fa-chevron-down")
    expanded.append(iconExpanded)
    expanded.addEventListener("click", collapsableEvent)

    infoResult.append(getResultItem(game, team0, team1))
    infoResult.append(separator)
    infoResult.append(getResultItem(game, team1, team0, true))
    infoResult.append(expanded)

    return infoResult
}
// ------------------------ //
function getGameInfoPlayers(game: Game): HTMLElement {
    const infoPlayers: HTMLElement = document.createElement("div")
    infoPlayers.classList.add("game__info-players")

    for (let i = 0; i < game.teams.length; i++) {
        const team: Team = game.teams[i]
        infoPlayers.append(getPlayersList(team))
    }
    return infoPlayers
}

function getPlayersList(team: Team): HTMLElement {
    const ul: HTMLElement = document.createElement("ul")

    for (let i = 0; i < team.players.length; i++) {
        const player = team.players[i]
        const li: HTMLElement = document.createElement("li")
        li.classList.add("fs-050", "fc-normal", "fw-300")
        li.innerHTML = `(${i+1}) ${player}`
        ul.append(li)
    }

    return ul
}
// ------------------------ //
function setGames(element: HTMLElement, games: Game[]): void {
    if (games && element ) {
        removeChildrens(element)

        if (Array.isArray(games)) {
            for (let i = 0; i < games.length; i++) {
                const game: Game = games[i]
                const gameElement: HTMLElement = document.createElement("div")
                gameElement.classList.add("game")

                const statusElement: HTMLElement = document.createElement("div")
                statusElement.classList.add("game__status")

                const statusInfo: HTMLElement = document.createElement("p")
                statusInfo.classList.add("fs-050", "fc-normal", "fw-800")
                statusInfo.innerHTML = game.is_finished ? "Final" : "Programado";
                statusElement.append(statusInfo)

                const statusDate: HTMLElement = document.createElement("p")
                statusDate.classList.add("fs-050", "fc-normal", "fw-300")
                const date: Date = new Date(game.datetime)
                const day: string = date.toLocaleDateString("es-AR", {
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric'
                })
                const hour: string = date.toLocaleTimeString("es-AR", {
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: false 
                })
                statusDate.innerHTML = `${day} ${hour}`
                statusElement.append(statusDate)

                const infoElement: HTMLElement = document.createElement("div")
                infoElement.classList.add("game__info")


                infoElement.append(getGameInfoResult(game))
                infoElement.append(getGameInfoPlayers(game))
                
                gameElement.append(statusElement)
                gameElement.append(infoElement)
                element.append(gameElement)

            }
        }
    }
}
// ------------------------ //
function setTable(element: HTMLElement, table: Table[]): void {
    const tableElement: HTMLElement | null = element.querySelector(".table")
    if (!tableElement) return
    removeChildrens(tableElement, true)

    for (let i = 0; i < table.length; i++) {
        const row: Table = table[i]
        const rowElement: HTMLElement = document.createElement("div");
        rowElement.classList.add(
            "table__row", "row-player", "fc-normal", "fs-050", "fw-400"
        )
        const keys: (keyof Table)[] = Object.keys(row) as (keyof Table)[];
        for (let j = -1; j < keys.length; j++) {
            const colElement: HTMLElement = document.createElement("div");
            const span: HTMLElement = document.createElement("span");
            if (j === -1) {
                span.classList.add("fw-800")
                span.innerHTML = `${i+1}`;
            } else  {
                const key: (keyof Table) = keys[j]
                if (j === 0 && key === "player") {
                    span.innerHTML = row[key].nickname ? row[key].nickname : ""
                } else {
                    if (j === 1) {
                        span.classList.add("fw-800")
                    }
                    span.innerHTML = `${row[key]}`
                }
                
            } 
            
            colElement.append(span)
            rowElement.append(colElement)
        }
        tableElement.append(rowElement)
    }
}
// ------------------------ //
function replaceData<Type>(data: Type): void {
    if (!dataContainer) return
    
    const { tournament, games, table }: any = data

    const title: HTMLElement | null = dataContainer.querySelector(".data-row__title > h3")
    if (title) {
        title.innerHTML = tournament.name ? tournament.name : "";
    }

    const gameContainer: HTMLElement | null = dataContainer.querySelector(".data-row__game")
    if (gameContainer) setGames(gameContainer, games)
    
    const tableContainer: HTMLElement | null = dataContainer.querySelector(".data-row__table")
    if (tableContainer) setTable(tableContainer, table)
}

function deactivateTournamet(tournaments: HTMLCollection, tournament: HTMLElement): void {
    [...tournaments].forEach((child)=> {
        if (child === tournament) return
        (child as HTMLElement).dataset.status = ""
    })
}

