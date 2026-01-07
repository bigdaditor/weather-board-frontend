import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';

function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const linkItems = [
    { label: '매출 입력', path: '/sales-input' },
    { label: '통계', path: '/stats' },
    { label: '매출 리스트', path: '/sales-list' },
  ];

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar>
        <Typography
          variant="h4"
          onClick={() => navigate('/sales-input')}
        >
          웨더 보드
        </Typography>

        <div className="menu">
          {linkItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                size="small"
                variant="contained"
                onClick={() => navigate(item.path)}
                color={isActive ? 'secondary' : 'primary'}
                className="menu-button ml-2"
                sx={{ border: 1, marginLeft: 1 }}
              >
                <Typography variant="h6">
                  {item.label}
                </Typography>
              </Button>
            );
          })}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopNav;
