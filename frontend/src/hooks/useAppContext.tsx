import { useContext } from "react";
import { AppContext } from "../context/ContextProvider";
import { AppContextType } from "../context/ContextProvider";

// Hook para usar el contexto más fácilmente
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe ser usado dentro de un AppContextProvider");
  }
  return context;
};