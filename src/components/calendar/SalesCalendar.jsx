import React, { useMemo } from 'react';
import { IconButton, Typography, Button, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

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

  // 다음 달: 마지막 주를 7칸으로만 맞춰서 채운다 (전체 4~6주 유동적)
  const remainder = cells.length % 7;
  const nextDays = remainder === 0 ? 0 : 7 - remainder;
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

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getWeatherBadge(summary) {
  if (!summary) return null;
  const normalized = summary.replace(/\s+/g, '');
  if (normalized.includes('강우')) {
    return { text: '강우', color: '#3b82f6' };
  }
  if (normalized.includes('맑음')) {
    return { text: '맑음', color: '#f59e0b' };
  }
  if (normalized.includes('흐림') || normalized.includes('구름')) {
    return { text: '흐림', color: '#94a3b8' };
  }
  return { text: summary, color: '#64748b' };
}

function SalesCalendar({
  currentDate,
  onMonthChange,
  onDateClick,
  salesByDate,
  weatherByDate,
  onAddClick,
  onEditClick,
}) {
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
    <Paper elevation={1} variant="outlined" sx={{ padding: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" onClick={handlePrevMonth}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Typography>
          {year}년 {month}월
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconButton size="small" onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
          <Button size="small" variant="contained" onClick={onAddClick}>
            매출입력
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {WEEK_DAYS.map((w) => (
          <div key={w} style={{ textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', padding: '4px 0' }}>
            {w}
          </div>
        ))}

        {cells.map((cell, idx) => {
          const dateKey = formatDateKey(cell.date);
          const amount = salesByDate[dateKey]?.amount;
          const weatherSummary = weatherByDate?.[dateKey]?.summary;
          const weatherBadge = getWeatherBadge(weatherSummary);
          const isToday = isSameDay(cell.date, today);
          const baseStyle = {
            borderRadius: 8,
            backgroundColor: '#ffffff',
            minHeight: 100,
            padding: 8,
            cursor: 'pointer',
            border: '1px solid #e8e8e8',
            display: 'flex',
            flexDirection: 'column',
            fontSize: '0.85rem',
            position: 'relative',
          };
          const fadedStyle = !cell.inCurrentMonth
            ? { backgroundColor: '#fafafa', color: '#bdbdbd' }
            : {};
          const todayStyle = isToday ? { border: '2px solid #1976d2' } : {};
          const cellStyle = { ...baseStyle, ...fadedStyle, ...todayStyle };

          return (
            <div
              key={idx}
              style={cellStyle}
              onClick={() => {
                if (typeof amount === 'number' && onEditClick) {
                  onEditClick(cell.date);
                } else {
                  onDateClick(cell.date);
                }
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 6,
                  zIndex: 2,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {cell.date.getDate()}
                </span>
                {weatherBadge && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 8px',
                      borderRadius: 999,
                      backgroundColor: weatherBadge.color,
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {weatherBadge.text}
                  </span>
                )}
              </div>
              {typeof amount === 'number' && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  padding: '4px 10px',
                  borderRadius: 999,
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}>
                  {amount.toLocaleString()}
                </div>
              )}
              {/* TODO: 추후 여기 날짜별 매출 합계 뱃지 같은 거 표시 가능 */}
            </div>
          );
        })}
      </div>
    </Paper>
  );
}

export default SalesCalendar;
