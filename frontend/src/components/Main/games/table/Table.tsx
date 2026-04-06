import { useAppContext } from "../../../../hooks/useAppContext";

import { TableRow, TablePlayerRow } from "../../../../types/contextTypes";

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
                data = (playerData[key]?.nickname || "N/A")
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

const Table: React.FC = () => {
    const { selected } = useAppContext();
    const table: TableRow = selected.table;
    console.log(selected)
    const playerDataRows = table.players.map((row, index) => (
        <RowTable key={index} header={false} playerData={row} position={index+1} />
    ))
    
    return (
        <div className="table">
            <RowTable header={true} playerData={null} position={null} />
            {playerDataRows}
        </div>
    )
}

export default Table;