import { Routes, Route } from 'react-router'
import MainPage from './pages/MainPage'
import SalesPage from "./pages/SalesPage.tsx";
import StatsPage from "./pages/StatsPage.tsx";
import Layout from "./components/Layout.tsx";

function App() {
  return (
    <Routes>
        <Route element={<Layout />}>
            <Route path="/" element={<MainPage />}/>
            <Route path="/sales" element={<SalesPage />}/>
            <Route path="/stats" element={<StatsPage />}/>
        </Route>
    </Routes>

  )
}

export default App
