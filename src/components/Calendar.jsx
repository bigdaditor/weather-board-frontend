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

export {
  buildMonthMatrix,
  isSameDay,
  formatDateKey
}