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
    const team01: Team = teams[0]
    const team01Result: GameResult = getTeamResult(result, team01)

    const team02: Team = teams[1]
    const team02Result: GameResult = getTeamResult(result, team02)

    return (
        <div className="game__info-result">
            <div className="result-item">
                <span className="fs-075 fc-normal fw-300">{team01.name}</span>
                <span className="fs-075 fc-normal fw-800">{team01Result}</span>
            </div>
            <div className="separator fs-075 fc-normal fw-400">-</div>
            <div className="result-item">
                <span className="fs-075 fc-normal fw-800">{team02Result}</span>
                <span className="fs-075 fc-normal fw-300">{team02.name}</span>
            </div>
            <div className="expand-button" onClick={handleClick}>
                <i className="fa-solid fa-chevron-down"></i>
            </div>
        </div>
    )
} 
