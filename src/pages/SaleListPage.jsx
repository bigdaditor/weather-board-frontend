import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from '@mui/material';
import '../styles/weatherboard.css';

function formatAmount(num) {
  if (num == null) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function SalesListPage() {
  const [sales, setSales] = useState([]);

  const fetchSales = async () => {
    try {
      const resp = await fetch('/sale'); // GET /sale 가정
      if (!resp.ok) throw new Error('매출 리스트 조회 실패');
      const data = await resp.json();
      setSales(data);
    } catch (err) {
      console.error(err);
      alert('매출 리스트 불러오다 터졌다.');
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div>
      <h2 className="wb-page-title">매출 리스트</h2>

      <div className="wb-table-wrapper">
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>날짜</TableCell>
                <TableCell>매출액</TableCell>
                <TableCell>매출 타입</TableCell>
                <TableCell>날씨 요약</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.input_date}</TableCell>
                  <TableCell>{formatAmount(row.amount)}</TableCell>
                  <TableCell>{row.sale_type}</TableCell>
                  <TableCell>{row.weather_summary}</TableCell>
                </TableRow>
              ))}
              {sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>데이터가 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default SalesListPage;