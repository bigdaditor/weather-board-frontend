import React from 'react';
import SalesCalendar from './SalesCalendar';

import { useSalesCalendar } from '../../hooks/useSalesCalendar';
import SaleDialog from "../SaleDialog.jsx";
import { useNavigate } from 'react-router-dom';
import { formatDateKey } from '../Calendar.jsx';

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
    handleSave,
    handleCloseDialog,
    setAmount,
    setSaleType,
    setSelectedDate,
    openNewDialog,
    status,
  } = useSalesCalendar({ refreshKey });

  const handleCalendarClick = (date) => {
    // Do not open dialog on cell click anymore — only notify parent if provided
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const handleAddClick = () => {
    openNewDialog();
  };

  const navigate = useNavigate();

  const handleEditFromCalendar = (date) => {
    // navigate to sale list and pass date as query param for convenience
    const key = formatDateKey(date);
    navigate(`/sales-list?date=${key}`);
  };

  return (
    <>
      <SalesCalendar
        currentDate={currentDate}
        onMonthChange={setCurrentDate}
        onDateClick={handleCalendarClick}
        onAddClick={handleAddClick}
        onEditClick={handleEditFromCalendar}
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
        onChangeDate={(val) => setSelectedDate(new Date(val))}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
      {status?.message && (
        <div className={`sales-info-banner${status.type === 'error' ? ' sales-info-banner--error' : ''}`}>
          {status.message}
        </div>
      )}
    </>
  );
}

export default SalesCalendarWithSales;
