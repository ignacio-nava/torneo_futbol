import NavBar from './components/NavBar.tsx';
import Main from './components/Main/Main.tsx';
import { AppContextProvider } from './context/ContextProvider.tsx';
import { MenuContextProvider } from './context/MenuContext.tsx';


const App: React.FC = () => {

  return (
    <AppContextProvider>
      <MenuContextProvider>
        <NavBar />
        <Main />
      </MenuContextProvider>
    </AppContextProvider>
  )
}

export default App
