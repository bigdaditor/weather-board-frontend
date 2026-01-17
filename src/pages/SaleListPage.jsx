import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Box,
  Typography,
  Container,
  Button,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import SaleDialog from "../components/SaleDialog.jsx";
import { fetchSales as apiFetchSales, updateSale } from "../api/sale";
import { DEFAULT_SALE_TYPE_VALUES, SALE_TYPE_LABELS } from "../constants/saleTypes";

function formatAmount(num) {
  if (num == null) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function saleTypeLabel(type) {
  if (!type) return "";
  return SALE_TYPE_LABELS[type] || type;
}

function buildMonthKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function shiftMonth(monthKey, diff) {
  const [y, m] = monthKey.split("-").map((v) => parseInt(v, 10));
  const d = new Date(y, m - 1 + diff, 1);
  return buildMonthKey(d);
}

function SalesListPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dateText, setDateText] = useState("");
  const [amount, setAmount] = useState("");
  const [saleType, setSaleType] = useState("");
  const location = useLocation();
  const [monthKey, setMonthKey] = useState(() => buildMonthKey(new Date()));
  const [groupedSales, setGroupedSales] = useState([]);

  const fetchSales = useCallback(async () => {
    try {
      const pageSize = 100;
      const firstPage = await apiFetchSales(1, pageSize);
      const totalPages = Number(firstPage?.total_pages) || 1;
      const allData = Array.isArray(firstPage?.data) ? [...firstPage.data] : [];

      if (totalPages > 1) {
        for (let page = 2; page <= totalPages; page += 1) {
          const resp = await apiFetchSales(page, pageSize);
          if (Array.isArray(resp?.data)) {
            allData.push(...resp.data);
          }
        }
      }

      const salesMap = {};

      const addEntry = (date, type, value) => {
        if (!date) return;
        if (!salesMap[date]) {
          salesMap[date] = {
            date,
            payment_types: {},
            total_amount: 0,
          };
        }
        const amountValue = Number(value) || 0;
        if (type) {
          salesMap[date].payment_types[type] =
            (salesMap[date].payment_types[type] || 0) + amountValue;
        }
        salesMap[date].total_amount += amountValue;
      };

      allData.forEach((item) => {
        if (!item?.date || !item.date.startsWith(monthKey)) return;
        if (item?.payment_types) {
          Object.entries(item.payment_types).forEach(([type, value]) => {
            addEntry(item.date, type, value);
          });
        }
      });

      const grouped = Object.values(salesMap).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setGroupedSales(grouped);
    } catch (err) {
      console.error(err);
      setGroupedSales([]);
    }
  }, [monthKey]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qdate = params.get("date");
    if (qdate) {
      setDateText(qdate);
      setMonthKey(qdate.slice(0, 7));
    }
  }, [location.search]);

  useEffect(() => {
    fetchSales().catch((err) => console.error(err));
  }, [fetchSales, monthKey]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qdate = params.get("date");
    if (!qdate) return;
    const target = document.getElementById(`sale-row-${qdate}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [location.search, groupedSales]);

  const handleSave = async () => {
    try {
      const payload = {
        input_date: dateText,
        amount: Number(amount),
        payment_type: saleType,
      };

      await updateSale(payload);
      await fetchSales();
      setDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert("저장 중 에러");
    }
  };

  const paymentTypes = useMemo(() => {
    const typeSet = new Set(DEFAULT_SALE_TYPE_VALUES);
    groupedSales.forEach((row) => {
      Object.keys(row.payment_types || {}).forEach((type) => typeSet.add(type));
    });
    return Array.from(typeSet).sort((a, b) => a.localeCompare(b));
  }, [groupedSales]);

  const saleTypeOptions = useMemo(
    () => paymentTypes.map((type) => ({ value: type, label: saleTypeLabel(type) })),
    [paymentTypes]
  );

  return (
    <Container maxWidth="lg">
      <div className="sub-container">
        <div className="title-bar">
          <Typography variant="h4">매출 리스트</Typography>
        </div>
        <div className="sub-content">
          <Paper elevation={1}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={2}
              py={1.5}
            >
              <Typography variant="h6">{monthKey}</Typography>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setMonthKey((prev) => shiftMonth(prev, -1))}
                >
                  이전 달
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setMonthKey((prev) => shiftMonth(prev, 1))}
                >
                  다음 달
                </Button>
              </Box>
            </Box>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ flex: 1, overflow: "auto" }}
            >
              <Table
                size="small"
                stickyHeader
                sx={{ tableLayout: "fixed" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: 16,
                        py: 0.75,
                        px: 1,
                        width: 110,
                        borderRight: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      날짜
                    </TableCell>
                    {paymentTypes.map((type) => (
                      <TableCell
                        key={type}
                        align="right"
                        sx={{
                          py: 0.75,
                          px: 1,
                          width: 110,
                          borderRight: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        {saleTypeLabel(type)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedSales.map((row, idx) => {
                    const key = row.date || String(idx);
                    return (
                      <TableRow
                        key={key}
                        id={row.date ? `sale-row-${row.date}` : undefined}
                        hover
                        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                      >
                        <TableCell
                          sx={{
                            py: 0.75,
                            px: 1,
                            width: 110,
                            borderRight: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          {row.date}
                        </TableCell>
                        {paymentTypes.map((type) => {
                          const value = row.payment_types?.[type];
                          return (
                            <TableCell
                              key={`${key}-${type}`}
                              align="right"
                              onClick={() => {
                                setDateText(row.date);
                                setSaleType(type);
                                setAmount(value ? String(value) : "");
                                setDialogOpen(true);
                              }}
                              sx={{
                                cursor: "pointer",
                                py: 0.75,
                                px: 1,
                                width: 110,
                                borderRight: "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              {value ? formatAmount(value) : ""}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                  {groupedSales.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={Math.max(paymentTypes.length + 1, 2)}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <Typography variant="h5">
                            데이터가 없습니다.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
        </div>
      </div>
      <SaleDialog
        open={dialogOpen}
        dateText={dateText}
        amount={amount}
        saleType={saleType}
        saleTypes={saleTypeOptions}
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
