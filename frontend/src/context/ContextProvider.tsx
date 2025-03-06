import { createContext, useState, useEffect, ReactNode } from "react";

import { ContextData, Selected } from "../types/contextTypes";
import { fetchSelectedData } from "../api/fetchData";

export interface AppContextType extends ContextData {
  updateSelected: (id: number) => Promise<void>;
  isLoadingData: boolean;
}

// Crea el contexto
const AppContext = createContext<AppContextType | undefined>(undefined);

// Crea un proveedor para el contexto
export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contextData, setContextData] = useState<ContextData>({
    tournaments: [],
    selected: {
      tournament: {
        id: null, 
        name: null, 
        start_date: null, 
        end_date: null,
        finished: false
      },
      games: [],
      table: []
    }
  });

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  useEffect(() => {
    const contextElement: HTMLElement | null = document.getElementById("context-data");
    if (contextElement) {
      const textContent = contextElement
        .textContent?.trim()
        .replace('<script id="context-data" type="application/json">','');
      if (textContent) setContextData(JSON.parse(textContent));
    }
  }, []);

  const updateSelected = async (id: number) => {
    try {
      setIsLoadingData(true);
      const newSelected: Selected = await fetchSelectedData(id);
      
      setContextData(prevData => ({
        ...prevData,
        selected: newSelected,
      }));
    } catch(error) {
      console.error("Error al actualizar los datos de selected:", error);
    } finally {
      setIsLoadingData(false);
    }
  }
  
  return (
    <AppContext.Provider value={{ ...contextData, updateSelected, isLoadingData }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
