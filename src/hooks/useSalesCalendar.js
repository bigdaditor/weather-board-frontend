import { useEffect, useMemo, useState } from 'react';
import { createSale, fetchSales, updateSale } from '../api/sale';

export function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function buildMonthKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function useSalesCalendar({ refreshKey = 0 } = {}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [salesByDate, setSalesByDate] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [saleType, setSaleType] = useState('');
  const [editingSaleId, setEditingSaleId] = useState(null);

  const monthKey = useMemo(() => buildMonthKey(currentDate), [currentDate]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSales();
        const map = {};

        data.forEach((item) => {
          if (typeof item.input_date !== 'string') return;
          const dateStr = item.input_date.slice(0, 10);
          if (!dateStr.startsWith(monthKey)) return;

          const amt = typeof item.amount === 'number'
            ? item.amount
            : Number(item.amount ?? 0);
          if (Number.isNaN(amt)) return;

          map[dateStr] = {
            id: item.id,
            amount: amt,
            payment_type: item.payment_type,
          };
        });

        setSalesByDate(map);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, [monthKey, refreshKey]);

  const handleDayClick = (date) => {
    const key = formatDateKey(date);
    const salesInfo = salesByDate[key];

    setSelectedDate(date);

    if (salesInfo) {
      setEditingSaleId(salesInfo.id);
      setAmount(String(salesInfo.amount));
      setSaleType(salesInfo.payment_type || '');
    } else {
      setEditingSaleId(null);
      setAmount('');
      setSaleType('');
    }

    setDialogOpen(true);
    return salesInfo;
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setAmount('');
    setSaleType('');
    setEditingSaleId(null);
  };

  const handleSave = async () => {
    try {
      if (!amount || Number.isNaN(Number(amount))) {
        alert('매출액 제대로 넣어라 햄.');
        return;
      }

      const dateKey = formatDateKey(selectedDate);
      const payload = {
        input_date: dateKey,
        amount: Number(amount),
        payment_type: saleType,
      };

      if (editingSaleId == null) {
        const saved = await createSale(payload);
        setSalesByDate((prev) => ({
          ...prev,
          [dateKey]: {
            id: saved.id,
            amount: saved.amount,
            payment_type: saved.payment_type,
          },
        }));
      } else {
        const updated = await updateSale(editingSaleId, payload);
        setSalesByDate((prev) => ({
          ...prev,
          [dateKey]: {
            id: updated.id,
            amount: updated.amount,
            payment_type: updated.payment_type,
          },
        }));
      }

      handleCloseDialog();
    } catch (e) {
      console.error(e);
      alert('매출 저장/수정 중 에러났다. 콘솔 한 번 봐라 햄.');
    }
  };

  const dateText = formatDateKey(selectedDate);
  const isEdit = editingSaleId != null;

  return {
    currentDate,
    setCurrentDate,
    salesByDate,
    dialogOpen,
    selectedDate,
    amount,
    saleType,
    isEdit,
    dateText,
    handleDayClick,
    handleSave,
    handleCloseDialog,
    setAmount,
    setSaleType,
  };
}
