import { createContext, ReactNode, useState } from "react";

export interface MenuContextProps {
    menuStatus: string;
    handleClick: () => void;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined)

export const MenuContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [menuStatus, setNavStatus] = useState<string>("")

    const handleClick = () => {
        setNavStatus(prevStatus => prevStatus === "active" ? "" : "active")
    }

    return (
        <MenuContext.Provider value={{ menuStatus, handleClick }}>
            {children}
        </MenuContext.Provider>
    )
}

export { MenuContext };