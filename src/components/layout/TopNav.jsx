import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import '../../styles/weatherboard.css';

function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const linkItems = [
    { label: '매출 입력', path: '/sales-input' },
    { label: '통계', path: '/stats' },
    { label: '매출 리스트', path: '/sales-list' },
  ];

  return (
    <AppBar position="static" elevation={0} className="wb-topnav-appbar">
      <Toolbar className="wb-topnav-toolbar">
        <Typography
          variant="h6"
          className="wb-topnav-brand"
          onClick={() => navigate('/sales-input')}
        >
          Weather Board
        </Typography>

        <Stack direction="row" spacing={1} className="wb-topnav-actions">
          {linkItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                size="small"
                variant={isActive ? 'contained' : 'text'}
                disableElevation
                className={`wb-topnav-btn${isActive ? ' wb-topnav-btn-active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default TopNav;
