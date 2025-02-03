import { Selected } from "../types/contextTypes";

const API_URL: string = "api/torneo/";

export const fetchSelectedData = async (id: number): Promise<Selected> => {
    const response = await fetch(`${API_URL}${id}/`, {
        method: "GET", 
        headers: {"Content-Type": "application/json"}
    });

    if (!response.ok) {
        throw new Error("Error al obtener los datos del torneo");
      }
      
    const data = await response.json();

    if (!data.selected) {
        throw new Error("La respuesta no contiene la clave 'selected'");
    }

    return data.selected;
}