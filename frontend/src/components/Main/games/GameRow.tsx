import { useState } from "react";
import { Game } from "../../../types/contextTypes"
import { GameInfoPlayers } from "./GameInfoPlayers";
import { GameInfoResult } from "./GameInfoResult";

export interface GameRowProps {
    game: Game;
}

const formatDate = (datetime: string): string => {
    const date: Date = new Date(datetime)
    const day = date.toLocaleDateString("es-AR", {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
    })
    const hour = date.toLocaleTimeString("es-AR", {
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    })
    return `${day} ${hour}`
} 

export const GameRow: React.FC<GameRowProps> = ({ game }) => {
    const [gameStatus, setGameStatus] = useState<"active" | "" >("")

    function handleClickCheron() {
        setGameStatus(prevStatus => prevStatus === "" ? "active" : "")
    } 
    
    return (
        <div className="game">
            <div className="game__status">
                <p className="fs-050 fc-normal fw-800">
                    {game.is_finished ? "Final" : "Programado"}
                </p>
                <p className="fs-050 fc-normal fw-300">
                    {formatDate(game.datetime)}
                </p>
            </div>
            <div className="game__info" data-status={gameStatus}>
                <GameInfoResult result={game.result} teams={game.teams} handleClick={handleClickCheron}/>
                <GameInfoPlayers teams={game.teams} status={gameStatus}/>
            </div>
        </div>
    )
}