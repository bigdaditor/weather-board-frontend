import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import SalesCalendarWithSales from "../components/calendar/SalesCalendarWithSales.jsx";

function SalesInputPage() {
  return (
    <Box>
      <Container maxWidth="lg">
        <div className="sub-container">
          <div className="title-bar">
            <Box>
              <Typography variant="h4">매출 입력</Typography>
            </Box>
        </div>
          <div className="sub-content">
            <SalesCalendarWithSales />
          </div>
        </div>
      </Container>
    </Box>
  );
}

export default SalesInputPage;
