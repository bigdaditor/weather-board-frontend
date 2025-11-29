import React, { useMemo } from 'react';
import { IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import '../../styles/weatherboard.css';

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function buildMonthMatrix(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 ~ 11

  const firstDay = new Date(year, month, 1);
  const firstWeekDay = firstDay.getDay(); // 0(일) ~ 6(토)

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = new Date(year, month - 1, 1);
  const daysInPrevMonth = new Date(
    prevMonth.getFullYear(),
    prevMonth.getMonth() + 1,
    0
  ).getDate();

  const cells = [];

  // 이전 달
  for (let i = firstWeekDay - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      inCurrentMonth: false,
    });
  }

  // 이번 달
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: new Date(year, month, d),
      inCurrentMonth: true,
    });
  }

  // 다음 달 (6주 * 7일 = 42칸)
  const totalCells = 42;
  const nextDays = totalCells - cells.length;
  for (let i = 1; i <= nextDays; i++) {
    cells.push({
      date: new Date(year, month + 1, i),
      inCurrentMonth: false,
    });
  }

  return cells;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function SalesCalendar({ currentDate, onMonthChange, onDateClick }) {
  const today = new Date();
  const cells = useMemo(() => buildMonthMatrix(currentDate), [currentDate]);

  const handlePrevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    onMonthChange(d);
  };

  const handleNextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    onMonthChange(d);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return (
    <div>
      <div className="wb-calendar-header">
        <IconButton size="small" onClick={handlePrevMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography className="wb-calendar-header-title">
          {year}년 {month}월
        </Typography>
        <IconButton size="small" onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </div>

      <div className="wb-calendar-grid">
        {WEEK_DAYS.map((w) => (
          <div key={w} className="wb-calendar-weekday">
            {w}
          </div>
        ))}

        {cells.map((cell, idx) => {
          const isToday = isSameDay(cell.date, today);
          const classNames = [
            'wb-calendar-cell',
            !cell.inCurrentMonth ? 'wb-calendar-cell-other-month' : '',
            isToday ? 'wb-calendar-cell-today' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div
              key={idx}
              className={classNames}
              onClick={() => onDateClick(cell.date)}
            >
              <div className="wb-calendar-date">{cell.date.getDate()}</div>
              {/* TODO: 추후 여기 날짜별 매출 합계 뱃지 같은 거 표시 가능 */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SalesCalendar;