import { useState, useEffect, useRef } from "react";
import { Team } from "../../../types/contextTypes";

interface PropsMain { 
    teams: Team[];
    status: "active" | "";
 }
interface PropsItem { nickname: string | null; index: number; }

const PlayerRow: React.FC<PropsItem> = ({ nickname, index }) => {
    const playerInfo = `(${index}) ${nickname}`
    return (
        <li className="fs-050 fc-normal fw-300">{playerInfo}</li>
    )
}

export const GameInfoPlayers: React.FC<PropsMain> = ({ teams, status }) => {
    const [maxHeight, setMaxHeight] = useState<number>(0);
    const divRef = useRef<HTMLDivElement>(null);

    const lightTeam: Team = teams[0]
    const lightTeamElements = lightTeam.players.map((player, index) => (
        <PlayerRow key={index} nickname={player} index={index+1}/>
    ))
    const darkTeam: Team = teams[1]
    const darkTeamElements = darkTeam.players.map((player, index) => (
        <PlayerRow key={index} nickname={player} index={index+1}/>
    ))

    useEffect(() => {
        if (divRef.current) {
            setMaxHeight(divRef.current.scrollHeight)
        }
    }, [teams])

    useEffect(() => {
        if (status === "active" && divRef.current) {
            setMaxHeight(divRef.current.scrollHeight)
        }
    }, [status])
    
    const objStyle = {
        "--max-height": (status === "" ? 0 : maxHeight) + "px" 
    } as React.CSSProperties

    return (
        <div 
        className="game__info-players" 
        ref={divRef} 
        style={objStyle}
        >
            <ul>{lightTeamElements}</ul>
            <ul>{darkTeamElements}</ul>
        </div>
    )
} 