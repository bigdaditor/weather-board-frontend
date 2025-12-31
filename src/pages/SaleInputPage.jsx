import React from 'react';
import '../styles/weatherboard.css';
import SalesCalendarWithSales from "../components/calendar/SalesCalendarWithSales.jsx";

function SalesInputPage() {
  return (
    <div>
      <h2 className="wb-page-title wb-page-title--card">매출 입력</h2>

      <div className="wb-card">
        <SalesCalendarWithSales />
      </div>
    </div>
  );
}

export default SalesInputPage;
