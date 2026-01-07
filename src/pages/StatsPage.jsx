import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchStatistics, fetchStatisticsSummary } from "../api/statistics";

const currencyFormatter = new Intl.NumberFormat("ko-KR");

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function StatsPage() {
  const [loading, setLoading] = useState(false);
  const [salesStats, setSalesStats] = useState([]); // weekly aggregated data
  const [monthlySeries, setMonthlySeries] = useState([]); // month over month data
  const [paymentType, setPaymentType] = useState("all");
  const [monthKey, setMonthKey] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchStats = async (month, payment_type = "all") => {
    try {
      const [year, m] = month.split("-").map((v) => parseInt(v, 10));
      const start = `${String(year)}-${String(m).padStart(2, "0")}-01`;
      const lastDay = new Date(year, m, 0).getDate();
      const end = `${String(year)}-${String(m).padStart(2, "0")}-${String(
        lastDay
      ).padStart(2, "0")}`;

      // weekly aggregated stats
      const weekly = await fetchStatistics({
        period_type: "week",
        start_date: start,
        end_date: end,
        payment_type: payment_type,
      });
      const weeklyArr = Array.isArray(weekly) ? weekly : [];
      const weeklyMap = {};
      weeklyArr.forEach((r) => {
        const key = r.period_start;
        weeklyMap[key] = (weeklyMap[key] || 0) + (r.total_amount || 0);
      });
      const weeklyMerged = Object.keys(weeklyMap)
        .sort()
        .map((k) => ({ date: k, total_amount: weeklyMap[k] }));
      setSalesStats(weeklyMerged);

      // month-over-month summary chart (all months)
      const monthly = await fetchStatisticsSummary("month", payment_type);
      const monthlyArr = Array.isArray(monthly) ? monthly : [];
      const sortedMonthly = monthlyArr
        .filter((r) => r.period_start)
        .sort((a, b) => new Date(a.period_start) - new Date(b.period_start))
        .slice(-12); // show recent 12 months to fit small screens
      setMonthlySeries(sortedMonthly);
    } catch (err) {
      console.error("fetchStats err", err);
    }
  };

  useEffect(() => {
    fetchStats(monthKey, paymentType);
  }, [monthKey, paymentType]);

  const handleSync = async () => {
    try {
      setLoading(true);
      // 날씨-매출 동기화 트리거 가정
      await fetch("http://localhost:8000/weather", { method: "POST" });
      await fetchStats(monthKey);
    } catch (err) {
      console.error(err);
      alert("동기화 중 에러.");
    } finally {
      setLoading(false);
    }
  };
  const labels = salesStats.map((d) => d.date);
  const totalSales = salesStats.map((d) => d.total_amount);

  const lineData = {
    labels,
    datasets: [
      {
        label: "주별 매출 합계",
        data: totalSales,
        borderWidth: 2,
        tension: 0.2,
      },
    ],
  };

  const totalAmount = totalSales.reduce((sum, v) => sum + (v || 0), 0);
  const averageWeek = salesStats.length
    ? Math.round(totalAmount / salesStats.length)
    : 0;
  const monthlyLabels = monthlySeries.map(
    (b) => b.period_start?.slice(0, 7) || ""
  );
  const monthlyTotals = monthlySeries.map((b) => b.total_amount || 0);
  const monthlyData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "월별 매출 합계",
        data: monthlyTotals,
        borderWidth: 2,
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        borderColor: "#2563eb",
        fill: true,
        tension: 0.25,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <Box>
      <Container maxWidth="lg">
        <div className="sub-container-stats">
          <div className="title-bar-stats">
            <Typography variant="h4">통계</Typography>
          </div>
          <div className="kpi-bar-stats">
            <Card sx={{ borderLeft: "4px solid #1976d2", width: 200}}>
              <CardHeader title="총 매출"/>
              <CardContent>
                <Typography variant="h6">
                  ₩{currencyFormatter.format(totalAmount)}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ marginLeft: 2, borderLeft: "4px solid #1976d2", width: 200}}>
              <CardHeader title="주 평균"/>
              <CardContent>
                <Typography variant="h6">
                  ₩{currencyFormatter.format(averageWeek)}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="filter-bar-stats">
            <div className="filter-bar-left-stats">
              <Box>
                <Typography variant="h5">조회 조건</Typography>
                <Typography>월과 결제타입을 바꾸고 바로 확인하세요.</Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  onClick={handleSync}
                  disabled={loading}
                >
                  {loading ? "동기화 중..." : "동기화"}
                </Button>
              </Box>
            </div>
            <div className="filter-bar-right-stats">
              <Box
                sx={{ minWidth: 150, marginRight: 2 }}
                >
                <TextField
                  label="월"
                  type="month"
                  size="small"
                  fullWidth
                  value={monthKey}
                  onChange={(e) => setMonthKey(e.target.value)}
                />
              </Box>
              <Box>
                <FormControl size="small" fullWidth>
                  <InputLabel id="payment-type-label">결제타입</InputLabel>
                  <Select
                    labelId="payment-type-label"
                    value={paymentType}
                    label="결제타입"
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                    <MenuItem value="all">전체</MenuItem>
                    <MenuItem value="card">카드</MenuItem>
                    <MenuItem value="cash">현금</MenuItem>
                    <MenuItem value="transfer">이체</MenuItem>
                    <MenuItem value="etc">기타</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>
          <div className="sub-content-stats">
            <Box sx={{marginBottom: 2}}>
              <div>
                <Typography variant="h5">
                  주별 매출 추이
                </Typography>
                <Typography variant="h6">
                  {monthKey} 주간 합계
                </Typography>
              </div>
              <Paper elevation={1}>
                {labels.length === 0 ? (
                  <Box sx={{height:"50px"}} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                    <Typography variant="h6">
                      해당 월의 통계 데이터가 없습니다.
                    </Typography>
                  </Box>
                ) : (
                  <Line data={lineData} options={commonOptions} />
                )}
              </Paper>
            </Box>

            <Box>
              <div>
                <Typography variant="h5">
                  월별 매출 추이
                </Typography>
                <Typography variant="h6">
                  최근 12개월 흐름을 확인하세요.
                </Typography>
              </div>
              <Paper elevation={1}>
                {monthlyLabels.length === 0 ? (
                  <Box sx={{height:"50px"}} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                    <Typography variant="h6">
                      해당 월의 통계 데이터가 없습니다.
                    </Typography>
                  </Box>
                ) : (
                  <Line data={monthlyData} options={commonOptions} />
                )}
              </Paper>
            </Box>
          </div>
        </div>
      </Container>
    </Box>
  );
}

export default StatsPage;
