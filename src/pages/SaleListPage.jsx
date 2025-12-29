import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  TablePagination,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import '../styles/weatherboard.css';
import SaleDialog from '../components/SaleDialog.jsx';
import { fetchSales as apiFetchSales, updateSale, createSale } from '../api/sale';

function formatAmount(num) {
  if (num == null) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function saleTypeLabel(type) {
  if (!type) return '';
  const map = {
    card: '카드',
    cash: '현금',
    online: '온라인',
    etc: '기타',
  };
  return map[type] || type;
}

function SalesListPage() {
  const [sales, setSales] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dateText, setDateText] = useState('');
  const [amount, setAmount] = useState('');
  const [saleType, setSaleType] = useState('');
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchSales = async () => {
    try {
      const data = await apiFetchSales();
      setSales(data);
      return data;
    } catch (err) {
      console.error(err);
      alert('매출 리스트 불러오다 터졌다.');
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetchSales();
        setSales(data);
        const params = new URLSearchParams(location.search);
        const qdate = params.get('date');
        if (qdate) {
          const match = data.find((s) => s.input_date && s.input_date.slice(0, 10) === qdate);
          if (match) {
            setEditingId(match.id ?? null);
            setDateText(match.input_date ? match.input_date.slice(0, 10) : '');
            setAmount(match.amount ?? '');
            setSaleType(match.payment_type ?? match.sale_type ?? '');
            setDialogOpen(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [location.search]);

  const openEdit = (row) => {
    setEditingId(row.id ?? null);
    setDateText(row.input_date ? row.input_date.slice(0, 10) : '');
    setAmount(row.amount ?? '');
    setSaleType(row.payment_type ?? row.sale_type ?? '');
    setDialogOpen(true);
  };


  const handleSave = async () => {
    try {
      const payload = {
        input_date: dateText,
        amount: Number(amount),
        payment_type: saleType,
      };

      if (editingId != null) {
        await updateSale(editingId, payload);
      } else {
        await createSale(payload);
      }

      await fetchSales();
      setDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert('저장 중 에러');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const v = parseInt(event.target.value, 10);
    setRowsPerPage(v);
    setPage(0);
  };

  return (
    <div>
      <h2 className="wb-page-title wb-page-title--aligned">매출 리스트</h2>

      <div className="wb-table-wrapper">
        <TableContainer component={Paper} elevation={0}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>날짜</TableCell>
                <TableCell>매출액</TableCell>
                <TableCell>매출 타입</TableCell>
                <TableCell>날씨 요약</TableCell>
                <TableCell>액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.input_date}</TableCell>
                  <TableCell>{formatAmount(row.amount)}</TableCell>
                  <TableCell>{saleTypeLabel(row.payment_type || row.sale_type)}</TableCell>
                  <TableCell>{row.weather_summary}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => openEdit(row)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>데이터가 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sales.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5,10,25,50]}
          />
        </TableContainer>
      </div>
      <SaleDialog
        open={dialogOpen}
        dateText={dateText}
        amount={amount}
        saleType={saleType}
        onChangeAmount={(v) => setAmount(v)}
        onChangeSaleType={(v) => setSaleType(v)}
        onChangeDate={(v) => setDateText(v)}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default SalesListPage;