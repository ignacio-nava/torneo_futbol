import { useMenuContext } from "../hooks/useMenuContext"


const NavBar: React.FC = () => {
    const { menuStatus, handleClick } = useMenuContext()

    return (
        <>
            <header>
                <nav>
                    <div className="container">
                        <div className="logo">
                            <img src="/static/img/philipsx_logo.png" alt="PHILIPS X" />
                        </div>
                        <div className="hamburger" onClick={handleClick} data-status={menuStatus}>
                            <div></div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default NavBar