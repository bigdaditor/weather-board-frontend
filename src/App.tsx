import { Routes, Route } from 'react-router'
import MainPage from './page/MainPage'
import SalesPage from "./page/SalesPage.tsx";
import StatsPage from "./page/StatsPage.tsx";

function App() {
  return (
    <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/sales" element={<SalesPage />}/>
        <Route path="/stats" element={<StatsPage />}/>
    </Routes>

  )
}

export default App
