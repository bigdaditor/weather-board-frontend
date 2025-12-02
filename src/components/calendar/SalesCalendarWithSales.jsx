import React, { useState, useEffect } from 'react';
import SalesCalendar from './SalesCalendar';

const API_BASE_URL = 'http://localhost:8000';

function buildMonthKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function SalesCalendarWithSales({ onDateClick, refreshKey = 0 }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [salesByDate, setSalesByDate] = useState({});

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/sale`);
        if (!resp.ok) throw new Error('매출 조회 실패');

        const data = await resp.json();
        const monthKey = buildMonthKey(currentDate);
        const map = {};

        data.forEach((item) => {
          if (typeof item.input_date !== 'string') return;

          const dateStr = item.input_date.slice(0, 10); // "YYYY-MM-DD"만 사용
          if (!dateStr.startsWith(monthKey)) return;

          const amt = typeof item.amount === 'number'
            ? item.amount
            : Number(item.amount ?? 0);
          if (Number.isNaN(amt)) return;

          if (!map[dateStr]) map[dateStr] = 0;
          map[dateStr] += amt;
        });

        setSalesByDate(map);
      } catch (e) {
        console.error(e);
      }
    };

    fetchSales();
  }, [currentDate, refreshKey]); // 🔸 월 바뀌거나 refreshKey 바뀌면 다시 조회

  return (
    <SalesCalendar
      currentDate={currentDate}
      onMonthChange={setCurrentDate}
      onDateClick={onDateClick}
      salesByDate={salesByDate}
    />
  );
}

export default SalesCalendarWithSales;