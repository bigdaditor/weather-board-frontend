import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopNav from './components/layout/TopNav';
import SalesInputPage from './pages/SaleInputPage';
import StatsPage from './pages/StatsPage';
import SalesListPage from './pages/SaleListPage';
import './styles/weatherboard.css';

function App() {
  return (
    <div className="wb-root">
      <BrowserRouter>
        <TopNav />
        <div className="wb-container">
          <Routes>
            <Route path="/" element={<Navigate to="/sales-input" replace />} />
            <Route path="/sales-input" element={<SalesInputPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/sales-list" element={<SalesListPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;