import { useContext } from "react"
import { MenuContext, MenuContextProps } from "../context/MenuContext"

export const useMenuContext = (): MenuContextProps => {
    const context = useContext(MenuContext)
    if (!context) {
        throw new Error("Error in useMenuContext");
    }
    return context;
}