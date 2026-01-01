import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import '../styles/weatherboard.css';
import SalesCalendarWithSales from "../components/calendar/SalesCalendarWithSales.jsx";

function SalesInputPage() {
  return (
    <Box className="sales-page">
      <Container maxWidth="md" className="sales-layout">
        <Box className="sales-header">
          <Typography variant="overline" className="stats-eyebrow">판매 관리</Typography>
          <Typography variant="h5" className="wb-page-title wb-page-title--card">매출 입력</Typography>
          <Typography variant="body2" className="sales-subtitle">날짜별로 바로 입력·수정하세요.</Typography>
        </Box>

        <Paper className="wb-card sales-calendar-card" elevation={1}>
          <SalesCalendarWithSales />
        </Paper>
      </Container>
    </Box>
  );
}

export default SalesInputPage;
