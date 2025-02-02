import { useAppContext } from "../../../hooks/useAppContext";
import { Tournament } from "../../../types/contextTypes";

interface TournamentProps 
extends Pick<Tournament, "id" | "name" > {
    isActive: boolean
}


const TournamentItem: React.FC<TournamentProps> = ({ id, name, isActive }) => {
    const { updateSelected } = useAppContext()
    if (!id) return <></>
    return (
        <li
            className="capitalize fw-300 ho-070"
            data-id={id}
            data-status={isActive ? "active" : ""}
            onClick={() => updateSelected(id)}
        >
            {name}
        </li>
    )
}

export default TournamentItem