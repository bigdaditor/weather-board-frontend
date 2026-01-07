import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import TopNav from './components/layout/TopNav';
import SalesInputPage from './pages/SaleInputPage';
import StatsPage from './pages/StatsPage';
import SalesListPage from './pages/SaleListPage';
import './App.css';

const theme = createTheme({
  typography: {
    fontFamily: [
      'MemomentKkukkukk',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Noto Sans KR"',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div className="container">
          <div className="header">
            <TopNav />
          </div>
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/sales-input" replace />} />
              <Route path="/sales-input" element={<SalesInputPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/sales-list" element={<SalesListPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
