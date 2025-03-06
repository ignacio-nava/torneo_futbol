import { useAppContext } from "../../../hooks/useAppContext";
import { useMenuContext } from "../../../hooks/useMenuContext";
import { Tournament } from "../../../types/contextTypes";

interface TournamentProps 
extends Pick<Tournament, "id" | "name" > {
    isActive: boolean
}


const TournamentItem: React.FC<TournamentProps> = ({ id, name, isActive }) => {
    const { updateSelected } = useAppContext();
    const { hiddeNavBar } = useMenuContext();
    if (!id) return <></>

    const handleClick = (id: number) => {
        updateSelected(id);
        hiddeNavBar();
    } 
    return (
        <li
            className="capitalize fw-300 ho-070"
            data-id={id}
            data-status={isActive ? "active" : ""}
            onClick={() => handleClick(id)}
        >
            {name}
        </li>
    )
}

export default TournamentItem