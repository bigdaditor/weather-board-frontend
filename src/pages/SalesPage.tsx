import { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, TextField, Button } from '@mui/material';

function SalesPage() {
  const [salesDate, setSalesDate] = useState(dayjs());
  const [salesPlace, setSalesPlace] = useState('');
  const [salesAmount, setSalesAmount] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^\d]/g, '');
    if (digits === '') {
      setSalesAmount('');
      return;
    }
    setSalesAmount(Number(digits).toLocaleString('ko-KR'));
  };

  const handleSubmit = async () => {
    const payload = {
      salesDate: salesDate.format('YYYY-MM-DD'),
      salesPlace,
      salesAmount: salesAmount.replace(/,/g, ''),
    };

    try {
      const response = await fetch('http://localhost:8080/sale/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('매출 데이터가 저장되었습니다!');
      } else {
        alert('저장 실패');
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류 발생');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70dvh',
        gap: 3,
        bgcolor: 'background.default',
        p: 2,
      }}
    >

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="매출일"
          value={salesDate}
          onChange={(newValue) => {
            if (newValue) setSalesDate(newValue);
          }}
          format="YYYY-MM-DD"
          slotProps={{
            textField: { fullWidth: true, sx: { width: 300 } },
          }}
        />
      </LocalizationProvider>

      <TextField
        label="매출처"
        variant="outlined"
        value={salesPlace}
        onChange={(e) => setSalesPlace(e.target.value)}
        sx={{ width: 300 }}
      />

      <TextField
        label="매출액"
        variant="outlined"
        value={salesAmount}
        onChange={handleAmountChange}
        inputProps={{ inputMode: 'numeric', pattern: '\\d*' }}
        sx={{ width: 300 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2, width: 300, fontSize: '1.2rem', fontWeight: 600 }}
      >
        저장
      </Button>
    </Box>
  );
}

export default SalesPage;