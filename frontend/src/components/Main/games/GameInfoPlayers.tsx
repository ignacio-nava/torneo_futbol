import { useState, useEffect, useRef } from "react";
import { Team, Event } from "../../../types/contextTypes";

interface PropsMain {
    teams: Team[];
    status: "active" | "";
    gameEvents: Event[];
}

interface PropsItem {
    nickname: string | null;
    index: number;
}

/*
|--------------------------------------------------------------------------
| Componente individual de jugador
|--------------------------------------------------------------------------
|
| Renderiza:
| (1) Nacho (TA), (RAS)
|
*/
const PlayerRow: React.FC<PropsItem> = ({ nickname, index }) => {
    const playerInfo = `(${index}) ${nickname}`;

    return (
        <li className="fs-050 fc-normal fw-300">
            {playerInfo}
        </li>
    );
};

export const GameInfoPlayers: React.FC<PropsMain> = ({
    teams,
    status,
    gameEvents
}) => {
    /*
    |--------------------------------------------------------------------------
    | Altura dinámica para animación expand/collapse
    |--------------------------------------------------------------------------
    |
    | Se usa scrollHeight para calcular la altura real del contenido.
    | Luego esa altura se guarda en una CSS Variable:
    |
    | --max-height
    |
    | Esto permite hacer transiciones suaves en CSS.
    |
    */
    const [maxHeight, setMaxHeight] = useState<number>(0);
    const divRef = useRef<HTMLDivElement>(null);

    /*
    |--------------------------------------------------------------------------
    | Generador reutilizable de jugadores
    |--------------------------------------------------------------------------
    |
    | Evita duplicar lógica para:
    | - lightTeam.players.map(...)
    | - darkTeam.players.map(...)
    |
    | Para cada jugador:
    | 1. Busca sus eventos
    | 2. Genera string: "(TA), (RAS)"
    | 3. Renderiza <PlayerRow />
    |
    */
    const renderPlayers = (team: Team) => {
        return team.players.map((player, index) => {

            /*
            ------------------------------------------------------------------
            | Eventos del jugador
            ------------------------------------------------------------------
            |
            | Ejemplo resultado:
            | "(TA), (RAS)"
            |
            */
            const eventsToAssign = gameEvents
                .filter(event => player.id === event.players__id)
                .map(event => {
                    const points = event.event__points;
                    const formattedPoints = points > 0 ? `+${points}` : `${points}`;

                    return `[${event.event__code}: ${formattedPoints}]`
                })
                .join(", ");

            /*
            ------------------------------------------------------------------
            | Texto final del jugador
            ------------------------------------------------------------------
            |
            | Ejemplo:
            | "Nacho (TA), (RAS)"
            |
            */
            const nickname = `${player.nickname} ${eventsToAssign}`;

            return (
                <PlayerRow
                    key={player.id}
                    nickname={nickname}
                    index={index + 1}
                />
            );
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Equipos
    |--------------------------------------------------------------------------
    */
    const lightTeam = teams[0];
    const darkTeam = teams[1];

    /*
    |--------------------------------------------------------------------------
    | Recalcular altura cuando:
    | - cambia el status
    | - cambian los equipos
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        if (!divRef.current) return;

        setMaxHeight(divRef.current.scrollHeight);
    }, [teams, status]);

    /*
    |--------------------------------------------------------------------------
    | CSS Variable dinámica
    |--------------------------------------------------------------------------
    */
    const objDivStyle = {
        "--max-height":
            (status === "" ? 0 : maxHeight) + "px"
    } as React.CSSProperties;

    return (
        <div
            className="game__info-players"
            ref={divRef}
            style={objDivStyle}
        >
            <ul>{renderPlayers(lightTeam)}</ul>

            <ul>{renderPlayers(darkTeam)}</ul>
        </div>
    );
};