import { useEffect, useState, useRef } from "react";
import { Game, Event } from "../../../types/contextTypes"
import { GameInfoPlayers } from "./GameInfoPlayers";
import { GameInfoResult } from "./GameInfoResult";

export interface GameRowProps {
    game: Game;
    gameEvents: Event[];
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

export const GameRow: React.FC<GameRowProps> = ({ game, gameEvents }) => {
    const [gameStatus, setGameStatus] = useState<"active" | "" >("")

    const [maxHeight, setMaxHeight] = useState<number>(0);
    const divRef = useRef<HTMLDivElement>(null);

    function handleClickCheron() {
        setGameStatus(prevStatus => prevStatus === "" ? "active" : "")
    }
 
    const eventsOutGame: Event[] = gameEvents.filter(event => !event.event__in_game)

    useEffect(() => {
        setGameStatus("");
    }, [game]);

    useEffect(() => {
        if (!divRef.current) return;
        setMaxHeight(divRef.current.scrollHeight);
    }, [gameStatus, gameEvents]);

    const objEventDivStyle = {
        "--max-height-events":
            (gameStatus === ""
                ? 0
                : maxHeight) + "px"
    } as React.CSSProperties;
    
    let eventsOutGameRow: React.ReactNode = null;

    if (eventsOutGame.length > 0) {
        eventsOutGameRow = (
            <div className="game__info-events fs-050 fc-normal fw-300" ref={divRef} style={objEventDivStyle}>
                <ul>
                    {
                        eventsOutGame.map((event, index) => {
                            const points = event.event__points;
                            const formattedPoints = points > 0 ? `+${points}` : `${points}`;

                            return (
                                <li key={index}>{`${event.players__nickname} [${event.event__name}: ${formattedPoints}]`}</li>
                            )
                        })
                    }
                </ul>
            </div>
        );
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
                <GameInfoResult
                    id={game.id} 
                    result={game.result} 
                    teams={game.teams}
                    handleClick={handleClickCheron}
                />
                <GameInfoPlayers teams={game.teams} status={gameStatus} gameEvents={gameEvents}/>
                {eventsOutGameRow}
            </div>
        </div>
    )
}