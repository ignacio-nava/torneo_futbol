import { useAppContext } from "../../../../hooks/useAppContext";

import { TableRow } from "../../../../types/contextTypes";

interface PropsRow {
    header: boolean;
    playerData: TableRow | null
    position: number | null
}

type TableRowKeys = keyof TableRow;
const Cols: [label: string, key: "" | TableRowKeys][] = [
    ["#", ""],
    ["Jugador", "player"],
    ["Pts", "total_points"],
    ["J", "games_played"],
    ["G", "games_won"],
    ["P", "games_lost"],
    ["E", "games_tied"],
    ["B", "games_with_bonus"],
];

const RowTable: React.FC<PropsRow> = ({ header, playerData, position }) => {
    let classNameRow = "table__row fc-normal fs-050 fw-400 ";
    classNameRow += header ? "row-head" : "row-player"

    const colsData = Cols.map((col, index) => {
        const key = col[1];
        let data: string;

        if (playerData) {
            if (key === "") {
                data = String(position)
            } else if (key === "player") {
                data = playerData[key]?.nickname || "N/A"
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
    const { selected } = useAppContext()
    const table: TableRow[] = selected.table
    
    const playerDataRows = table.map((row, index) => (
        <RowTable key={index} header={false} playerData={row} position={index+1}/>
    ))

    return (
        <div className="table">
            <RowTable header={true} playerData={null} position={null}/>
            {playerDataRows}
        </div>
    )
}

export default Table;