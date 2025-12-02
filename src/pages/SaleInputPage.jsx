import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import SalesCalendar from '../components/calendar/SalesCalendar';
import '../styles/weatherboard.css';
import SalesCalendarWithSales from "../components/calendar/SalesCalendarWithSales.jsx";

const API_BASE_URL = 'http://localhost:8000';

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function SalesInputPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [saleType, setSaleType] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setAmount('');
    setSaleType('');
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        input_date: formatDate(selectedDate),
        amount: Number(amount),
        payment_type: saleType,
      };

      const resp = await fetch(`${API_BASE_URL}/sale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error('매출 저장 실패');
      }

      handleClose();
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert('매출 저장 중 에러 났다. 콘솔도 한 번 봐라 햄.');
    }
  };

  return (
    <div>
      <h2 className="wb-page-title">매출 입력</h2>

      <div className="wb-card">
        <SalesCalendarWithSales
          onDateClick={handleDateClick}
          refreshKey={refreshKey}
        />
      </div>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>매출 입력</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="날짜"
            fullWidth
            value={formatDate(selectedDate)}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="매출액"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <TextField
            margin="dense"
            label="매출 타입"
            fullWidth
            select
            value={saleType}
            onChange={(e) => setSaleType(e.target.value)}
          >
            <MenuItem value="card">카드</MenuItem>
            <MenuItem value="cash">현금</MenuItem>
            <MenuItem value="online">온라인</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button variant="contained" onClick={handleSubmit}>
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SalesInputPage;