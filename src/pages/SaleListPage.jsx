import React, { useCallback, useEffect, useState } from "react";
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
  Container,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import SaleDialog from "../components/SaleDialog.jsx";
import {
  fetchSales as apiFetchSales,
  updateSale,
  deleteSale,
} from "../api/sale";

function formatAmount(num) {
  if (num == null) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function saleTypeLabel(type) {
  if (!type) return "";
  const map = {
    card: "카드",
    cash: "현금",
    online: "온라인",
    etc: "기타",
  };
  return map[type] || type;
}

function SalesListPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dateText, setDateText] = useState("");
  const [amount, setAmount] = useState("");
  const [saleType, setSaleType] = useState("");
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [expandedRowId, setExpandedRowId] = useState(null);
  const [groupedSales, setGroupedSales] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSales = useCallback(
    async (requestedPage = 0, requestedPageSize = 10) => {
      try {
        // API expects 1-based page
        const apiPage = requestedPage + 1;
        console.log('[fetchSales] requestedPage:', requestedPage, 'apiPage:', apiPage);
        const resp = await apiFetchSales(apiPage, requestedPageSize);
        console.log('[fetchSales] API response:', resp);

        if (resp && resp.data) {
          const grouped = resp.data.map((d) => ({
            ...d,
            items: d.items || [],
          }));
          setGroupedSales(grouped);
          setTotalCount(resp.total || grouped.length);
          // Don't update page state here - it causes pagination to reset
          // setRowsPerPage and setPage should only be updated by user actions
        } else {
          setGroupedSales([]);
          setTotalCount(0);
        }

        return resp;
      } catch (err) {
        console.error(err);
        alert("매출 리스트 불러오다 터졌다.");
        return [];
      }
    },
    []
  );

  const toggleRow = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const handleDeleteType = async (items) => {
    console.log("Deleting items:", items);
    if (!items || items.length === 0) {
      alert("삭제할 항목이 없습니다.");
      return;
    }
    if (!confirm("해당 타입의 모든 항목을 삭제하시겠습니까?")) return;
    try {
      await deleteSale(items);
      await fetchSales(page, rowsPerPage);
    } catch (e) {
      console.error(e);
      alert("삭제 중 에러");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetchSales(0, rowsPerPage);
        const params = new URLSearchParams(location.search);
        const qdate = params.get("date");
        if (qdate) {
          const match = Array.isArray(resp)
            ? resp.find &&
              resp.find(
                (s) =>
                  (s.date || (s.input_date && s.input_date.slice(0, 10))) ===
                  qdate
              )
            : null;
          if (match) {
            setDialogOpen(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleSave = async () => {
    try {
      const payload = {
        input_date: dateText,
        amount: Number(amount),
        payment_type: saleType,
      };

      await updateSale(payload);
      await fetchSales(page, rowsPerPage);
      setDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert("저장 중 에러");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchSales(newPage, rowsPerPage).catch((e) => console.error(e));
  };

  const handleChangeRowsPerPage = (event) => {
    const v = parseInt(event.target.value, 10);
    setRowsPerPage(v);
    setPage(0);
    fetchSales(0, v);
  };

  return (
    <Container maxWidth="lg">
      <div className="sub-container">
        <div className="title-bar">
          <Typography variant="h4">매출 리스트</Typography>
        </div>
        <div className="sub-content">
          <Paper elevation={1}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ flex: 1, overflow: "auto" }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{fontSize: 16}}>날짜</TableCell>
                    <TableCell>매출액</TableCell>
                    <TableCell>액션</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedSales.map((row, idx) => {
                    const key = row.date || String(idx);
                    return (
                      <React.Fragment key={key}>
                        <TableRow
                          hover
                          onClick={() => toggleRow(key)}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{formatAmount(row.total_amount)}</TableCell>
                          <TableCell />
                        </TableRow>

                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={3}
                          >
                            <Collapse
                              in={expandedRowId === key}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box margin={1}>
                                {(!row.payment_types ||
                                  Object.keys(row.payment_types).length ===
                                    0) && (
                                  <Typography variant="body2">
                                    상세 내역이 없습니다.
                                  </Typography>
                                )}
                                {row.payment_types &&
                                  Object.entries(row.payment_types).map(
                                    ([type, amount]) => {
                                      return (
                                        <Box key={`${key}::${type}`} mb={1} borderBottom={1}>
                                          <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            p={1}
                                          >
                                            <Box
                                              display="flex"
                                              alignItems="center"
                                              gap={1}
                                            >
                                              <Typography variant="subtitle2">
                                                {saleTypeLabel(type)}
                                              </Typography>
                                            </Box>
                                            <Box
                                              display="flex"
                                              alignItems="center"
                                              gap={1}
                                            >
                                              <Typography variant="subtitle2">
                                                {formatAmount(amount)}
                                              </Typography>
                                              <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setDateText(row.date);
                                                  setAmount(amount);
                                                  setSaleType(type);
                                                  setDialogOpen(true);
                                                }}
                                              >
                                                <Edit fontSize="small" />
                                              </IconButton>
                                              <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  const payload = {
                                                    input_date: row.date,
                                                    payment_type: type,
                                                  };
                                                  handleDeleteType(payload);
                                                }}
                                              >
                                                <Delete fontSize="small" />
                                              </IconButton>
                                            </Box>
                                          </Box>
                                        </Box>
                                      );
                                    }
                                  )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                  {groupedSales.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>데이터가 없습니다.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={totalCount || groupedSales.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from} - ${to} / 전체 ${count !== -1 ? count : `${to}+`}개`
                }
                labelRowsPerPage="페이지당 행 수:"
              />
            </TableContainer>
          </Paper>
          
        </div>
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
    </Container>
  );
}

export default SalesListPage;
