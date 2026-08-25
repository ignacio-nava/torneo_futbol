import { useAppContext } from "../../../../hooks/useAppContext";

import { TableRow, TablePlayerRow, TableEventRow } from "../../../../types/contextTypes";

interface PropsRow {
    header: boolean;
    playerData: TablePlayerRow | null
    position: number | null
}

type TableRowKeys = keyof TablePlayerRow;
const Cols: [label: string, key: "" | TableRowKeys][] = [
    ["#", ""],
    ["Jugador", "player"],
    ["Pts", "total_points"],
    ["J", "games_played"],
    ["G", "games_won"],
    ["P", "games_lost"],
    ["E", "games_tied"],
    ["B", "games_with_bonus"],
    ["Últimas", "last_matches"],
];

const resultsAvilables  = {
    "W": () => ["win", "V"],
    "T": () => ["tie", "E"],
    "L": () => ["lose", "P"],
    "_": () => ["not-played", "-"]
}

const RowTable: React.FC<PropsRow> = ({ header, playerData, position }) => {
    // Se definen las clases del elemento HTML
    let classNameRow = "table__row fc-normal fs-050 fw-400 ";
    classNameRow += header ? "row-head" : "row-player"

    // Se crean los elementos en base al objeto Cols
    const colsData = Cols.map((col, index) => {
        const key = col[1];
        let data: React.ReactNode; // string;
        
        if (playerData) {
            if (key === "") {
                data = String(position)
            } else if (key === "player") {
                const asterisk: string = playerData.has_extra_points ? " [*]" : ""
                data = (playerData[key]?.nickname || "N/A") + asterisk
            } else if (key === "last_matches") {
                data = (
                    <ul className="last-matches-list">
                        {playerData.last_matches.map((match, i) => {
                            const [resultStatus, status] = resultsAvilables[match]()
                            return (
                                <li key={i} data-status={resultStatus}>
                                    <div className="fw-700">{status}</div>
                                </li>
                            )
                        })}
                    </ul>
                )
            } else {
                data = String(playerData[key])
            }

        } else {
            data = col[0]
        }
        
        return (
            <div key={index}>
                <span 
                    className={(index === 0) || (index === 2) ? "fw-800" : ""}
                >
                    {data}
                </span>
            </div>
        )
    })
   
    return (
        <div className={classNameRow}>
            {colsData}
        </div>
    )
}

const getEventDescription = (events: TableEventRow[]): string => {
    // Se arman las descripciones de los eventos
    const eventDescriptions = events.map(event => {
        const points = event.total_event_points > 0 
            ? `+${event.total_event_points}` 
            : String(event.total_event_points);

        return `${event.event_name} (x${event.event_count}): ${points}`;
    });

    return eventDescriptions.join(" | ")
};

const Table: React.FC = () => {
    const { selected } = useAppContext();
    const table: TableRow = selected.table;
    
    const playerDataRows = table.players.map((row, index) => (
        <RowTable key={index} header={false} playerData={row} position={index+1} />
    ))

    const eventsByPlayerRows = table.events_by_player.map((event, index) => {
        const total_points = event.points_to_table > 0 
            ? `+${event.points_to_table}` 
            : event.points_to_table

        return (
            <li key={index} className="event-table-row">
                {`[*] ${event.player_nickname} → `}
                <span className="fw-400">{`${getEventDescription(event.events)} → ${total_points}`}</span>
            </li>
        )
    })

    return (
        <div className="table">
            <RowTable header={true} playerData={null} position={null} />
            {playerDataRows}
            <div className="fs-050 fc-normal fw-300">
                <ul className="events-table">{eventsByPlayerRows}</ul>
            </div>
        </div>
    )
}

export default Table;