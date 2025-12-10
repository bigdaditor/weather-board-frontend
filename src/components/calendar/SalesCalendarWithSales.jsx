import React from 'react';
import SalesCalendar from './SalesCalendar';

import { useSalesCalendar } from '../../hooks/useSalesCalendar';
import SaleDialog from "../SaleDialog.jsx";

function SalesCalendarWithSales({ onDateClick, refreshKey = 0 }) {
  const {
    currentDate,
    setCurrentDate,
    salesByDate,
    dialogOpen,
    amount,
    saleType,
    isEdit,
    dateText,
    handleDayClick,
    handleSave,
    handleCloseDialog,
    setAmount,
    setSaleType,
  } = useSalesCalendar({ refreshKey });

  const handleCalendarClick = (date) => {
    const saleInfo = handleDayClick(date);
    if (onDateClick) {
      onDateClick(date, saleInfo);
    }
  };

  return (
    <>
      <SalesCalendar
        currentDate={currentDate}
        onMonthChange={setCurrentDate}
        onDateClick={handleCalendarClick}
        salesByDate={salesByDate}
      />
      <SaleDialog
        open={dialogOpen}
        dateText={dateText}
        amount={amount}
        saleType={saleType}
        isEdit={isEdit}
        onChangeAmount={setAmount}
        onChangeSaleType={setSaleType}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
    </>
  );
}

export default SalesCalendarWithSales;