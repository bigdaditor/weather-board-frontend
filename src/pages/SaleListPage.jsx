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
  Collapse,
  Box,
  Typography,
} from '@mui/material';
import { Edit, Delete, ExpandMore } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import '../styles/weatherboard.css';
import SaleDialog from '../components/SaleDialog.jsx';
import { fetchSales as apiFetchSales, updateSale, createSale, deleteSale } from '../api/sale';

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

  const [expandedRowId, setExpandedRowId] = useState(null);
  const [expandedTypeKeys, setExpandedTypeKeys] = useState({});

  const toggleRow = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const toggleType = (rowId, type) => {
    const key = `${rowId}::${type}`;
    setExpandedTypeKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDelete = async (id) => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await deleteSale(id);
      await fetchSales();
    } catch (e) {
      console.error(e);
      alert('삭제 중 에러');
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
              {sales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const rowDateKey = row.input_date ? row.input_date.slice(0, 10) : '';
                const itemsForDate = sales.filter((s) => s.input_date && s.input_date.slice(0, 10) === rowDateKey);
                const typesMap = itemsForDate.reduce((acc, it) => {
                  const t = it.payment_type || it.sale_type || 'unknown';
                  if (!acc[t]) acc[t] = { items: [], total: 0 };
                  acc[t].items.push(it);
                  acc[t].total += Number(it.amount || 0);
                  return acc;
                }, {});

                return (
                  <React.Fragment key={row.id}>
                    <TableRow hover onClick={() => toggleRow(row.id)} style={{ cursor: 'pointer' }}>
                      <TableCell>{row.input_date}</TableCell>
                      <TableCell>{formatAmount(row.amount)}</TableCell>
                      <TableCell>{saleTypeLabel(row.payment_type || row.sale_type)}</TableCell>
                      <TableCell>{row.weather_summary}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); openEdit(row); }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                        <Collapse in={expandedRowId === row.id} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            {Object.keys(typesMap).length === 0 && (
                              <Typography variant="body2">상세 내역이 없습니다.</Typography>
                            )}
                            {Object.entries(typesMap).map(([type, info]) => {
                              const key = `${row.id}::${type}`;
                              return (
                                <Box key={key} mb={1}>
                                  <Box display="flex" alignItems="center" justifyContent="space-between" className={`sale-type-summary type-${type}`} p={1}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleType(row.id, type); }}>
                                        <ExpandMore fontSize="small" style={{ transform: expandedTypeKeys[key] ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                                      </IconButton>
                                      <Typography variant="subtitle2">{saleTypeLabel(type)}</Typography>
                                    </Box>
                                    <Typography variant="subtitle2">총합: {formatAmount(info.total)}</Typography>
                                  </Box>

                                  <Collapse in={!!expandedTypeKeys[key]} timeout="auto" unmountOnExit>
                                    <Box>
                                      {info.items.map((it) => (
                                        <Box key={it.id} display="flex" alignItems="center" justifyContent="space-between" className={`sale-item-row type-${type}`} p={1} mt={0.5}>
                                          <Box>
                                            <Typography variant="body2">{it.input_date} — {it.description || ''}</Typography>
                                            <Typography variant="body2">{formatAmount(it.amount)}</Typography>
                                          </Box>
                                          <Box>
                                            <IconButton size="small" onClick={() => openEdit(it)}>
                                              <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDelete(it.id)}>
                                              <Delete fontSize="small" />
                                            </IconButton>
                                          </Box>
                                        </Box>
                                      ))}
                                    </Box>
                                  </Collapse>
                                </Box>
                              );
                            })}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
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