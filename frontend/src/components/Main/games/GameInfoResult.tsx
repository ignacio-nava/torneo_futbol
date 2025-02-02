import { Game, Team } from "../../../types/contextTypes"

type PropsGame = Omit<Game, "datetime" | "is_finished" | "bonus">
type GameResult = "V" | "P" | "E" | "-"

interface Props extends PropsGame {
    handleClick: () => void;
}

function getTeamResult(result: string | null, team: Team): GameResult {
    if (!result) return "-"
    if (result === "T") return "E"
    return result === team.role ? "V" : "P"
}

export const GameInfoResult: React.FC<Props> = ({ result, teams, handleClick }) => {
    const lightTeam: Team = teams[0]
    const lightTeamResult: GameResult = getTeamResult(result, lightTeam)

    const darkTeam: Team = teams[1]
    const darkTeamResult: GameResult = getTeamResult(result, darkTeam)

    return (
        <div className="game__info-result">
            <div className="result-item">
                <span className="fs-075 fc-normal fw-300">Equipo Claro</span>
                <span className="fs-075 fc-normal fw-800">{lightTeamResult}</span>
            </div>
            <div className="separator fs-075 fc-normal fw-400">-</div>
            <div className="result-item">
                <span className="fs-075 fc-normal fw-800">{darkTeamResult}</span>
                <span className="fs-075 fc-normal fw-300">Equipo Claro</span>
            </div>
            <div className="expand-button" onClick={handleClick}>
                <i className="fa-solid fa-chevron-down"></i>
            </div>
        </div>
    )
} 
