import DataInfo from "./DataInfo";
import TournamentNavigation from "./tournamentNav/TournamentNavigation"


const Main: React.FC = () => {
    return (
        <>
        <main>
            <div className="container displayer">
                <TournamentNavigation />
                <DataInfo />
            </div>
        </main>
        </>
    )
}

export default Main