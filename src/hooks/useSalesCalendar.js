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

          if (!map[dateStr]) map[dateStr] = { amount: 0, items: [] };
          map[dateStr].amount += amt;
          map[dateStr].items.push({
            id: item.id,
            amount: amt,
            payment_type: item.payment_type,
          });
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

  const openNewDialog = (date = new Date()) => {
    setSelectedDate(date);
    setEditingSaleId(null);
    setAmount('');
    setSaleType('');
    setDialogOpen(true);
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
        setSalesByDate((prev) => {
          const next = { ...prev };
          if (!next[dateKey]) next[dateKey] = { amount: 0, items: [] };
          next[dateKey].items = [...next[dateKey].items, { id: saved.id, amount: saved.amount, payment_type: saved.payment_type }];
          next[dateKey].amount = next[dateKey].items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
          return next;
        });
      } else {
        const updated = await updateSale(editingSaleId, payload);
        // find and replace the item in any date bucket; item id may stay same or date may change
        setSalesByDate((prev) => {
          const next = {};
          Object.keys(prev).forEach((k) => {
            next[k] = { amount: prev[k].amount, items: [...prev[k].items] };
          });

          // remove existing occurrence
          Object.keys(next).forEach((k) => {
            next[k].items = next[k].items.filter((it) => it.id !== editingSaleId);
            next[k].amount = next[k].items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
            if (next[k].items.length === 0) delete next[k];
          });

          // add updated into target dateKey
          if (!next[dateKey]) next[dateKey] = { amount: 0, items: [] };
          next[dateKey].items = [...next[dateKey].items, { id: updated.id, amount: updated.amount, payment_type: updated.payment_type }];
          next[dateKey].amount = next[dateKey].items.reduce((s, it) => s + (Number(it.amount) || 0), 0);

          return next;
        });
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
    setSelectedDate,
    openNewDialog,
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
