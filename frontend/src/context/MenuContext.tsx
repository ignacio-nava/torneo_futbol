import { createContext, ReactNode, useState } from "react";

export interface MenuContextProps {
    menuStatus: string;
    handleClick: () => void;
    hiddeNavBar: () => void;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined)

export const MenuContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [menuStatus, setNavStatus] = useState<string>("")

    const handleClick = () => {
        setNavStatus(prevStatus => prevStatus === "active" ? "" : "active");
    }

    const hiddeNavBar = () => {
        setNavStatus("")
    }

    return (
        <MenuContext.Provider value={{ menuStatus, handleClick, hiddeNavBar }}>
            {children}
        </MenuContext.Provider>
    )
}

export { MenuContext };