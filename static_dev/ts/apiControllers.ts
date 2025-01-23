const API_URL: string = "http://127.0.0.1:8000/api/torneo/"


async function getTorneoData(id:string | undefined): Promise<any>  {
    const url = `${API_URL}${id}/`;
    try {
        const response = await fetch(url, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json", 
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json(); 
        return data;
    } catch (error) {
        console.error("Error fetching tournament:", error);
        throw error;
    }
}



if (tournamentsNav) {
    const tournaments: HTMLCollection = tournamentsNav.children;

    [...tournaments].forEach((child) => {
        child.addEventListener("click", async e => {
            const tournament = e.target as HTMLElement;
            tournament.dataset.status = "active"
            deactivateTournamet(tournaments, tournament)
            const tournamentData = await getTorneoData(tournament.dataset.id)
            replaceData(tournamentData?.selected)
        });
    });
}