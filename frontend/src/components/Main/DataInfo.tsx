import { useCallback, useState } from "react";
import { useAppContext } from "../../hooks/useAppContext";
import { GameRow } from "./games/GameRow";
import Table from "./games/table/Table";

const DataInfo: React.FC = () => {
    const [activeType, setActiveType] = useState<'games' | 'table'>('games');
    const { selected, isLoadingData } = useAppContext()
    const { tournament, games } = selected

    const handleClick = useCallback((type: 'games' | 'table') => {
        setActiveType(type);
      }, []);

    const gameElements = games.map((game, index) => (
        <GameRow key={index} game={game}/>
    ))
    
    return (
        <div className="data-info">
            <div className="title-row">
                <h2 
                    className="fs-075 fc-lead fw-800 upper ho-070"
                    data-type="games"
                    data-status={activeType === "games" ? "active" : ""}
                    onClick={() => handleClick("games")}
                >Partidos</h2>
                <h2 
                    className="fs-075 fc-lead fw-800 upper ho-070"
                    data-type="table"
                    data-status={activeType === "table" ? "active" : ""}
                    onClick={() => handleClick("table")}
                >Tabla</h2>
            </div>
            {
                isLoadingData ? 
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div> :
                <div className="data-row">
                <div className="data-row__title">
                    <h3 className="fs-075 fc-normal fw-800 upper">
                        { tournament.name } 
                        {
                            tournament.finished && 
                            <span className="fw-300 capitalize fs-050 finished-tag">Finalizado</span>
                        }
                    </h3>
                </div>
                <div
                    className="data-row__game" 
                    data-status={activeType === "games" ? "active" : ""}
                >
                    {gameElements}
                </div>
                <div 
                    className="data-row__table"
                    data-status={activeType === "table" ? "active" : ""}
                >
                    <Table />
                </div>
            </div>
            }
        </div>
    )
}

export default DataInfo 