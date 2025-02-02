import { useAppContext } from "../../../hooks/useAppContext"
import { useMenuContext } from "../../../hooks/useMenuContext"

import TournamentItem from "./TournamentItem"


const TournamentNavigation: React.FC = () => {
    const { tournaments, selected } = useAppContext()
    const { menuStatus } = useMenuContext()
    
    const tournamentsElements = tournaments.map((tournament, index) => (
        <TournamentItem 
            key={index}
            id={tournament.id}
            name={tournament.name}
            isActive={tournament.id === selected.tournament.id}
        />
    ))

    return (
        <>
        <div className="tournament-navigation" data-status={menuStatus}>
            <h2 className="fs-075 fc-lead fw-800 upper">Torneos</h2>
            <ul className="fc-normal fs-075">
                {tournamentsElements}
            </ul>
        </div>
        </>
    )
}

export default TournamentNavigation