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
import {
  fetchStatistics,
  fetchStatisticsSummary,
  fetchWeatherMonthlyStats,
} from "../api/statistics";
import { SALE_TYPES } from "../constants/saleTypes";

const currencyFormatter = new Intl.NumberFormat("ko-KR");

const getWeekOfMonth = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const offset = firstDay.getDay();
  return Math.floor((date.getDate() + offset - 1) / 7) + 1;
};

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
  const [weatherMonthlySeries, setWeatherMonthlySeries] = useState([]);
  const [weatherSummary, setWeatherSummary] = useState("all");
  const weatherSummaryOptions = ["맑음", "흐림", "강우"];
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

      const weatherMonthly = await fetchWeatherMonthlyStats({
        summary: weatherSummary === "all" ? undefined : weatherSummary,
      });
      const weatherArr = Array.isArray(weatherMonthly) ? weatherMonthly : [];
      setWeatherMonthlySeries(weatherArr);
    } catch (err) {
      console.error("fetchStats err", err);
    }
  };

  useEffect(() => {
    fetchStats(monthKey, paymentType);
  }, [monthKey, paymentType, weatherSummary]);

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

  const handleRecomputeStats = async () => {
    try {
      setLoading(true);
      await fetch("http://localhost:8000/statistics/recompute", {
        method: "POST",
      });
      await fetchStats(monthKey, paymentType);
    } catch (err) {
      console.error(err);
      alert("통계 재계산 중 에러.");
    } finally {
      setLoading(false);
    }
  };
  const labels = salesStats.map((d) => d.date);
  const totalSales = salesStats.map((d) => d.total_amount);
  const totalAmount = totalSales.reduce((sum, v) => sum + (v || 0), 0);
  const weeklyAverageForMonth = salesStats.length
    ? Math.round(totalAmount / salesStats.length)
    : 0;
  const [selectedYear, selectedMonth] = monthKey
    .split("-")
    .map((v) => parseInt(v, 10));
  const monthStartDate = new Date(selectedYear, selectedMonth - 1, 1);
  const monthEndDate = new Date(selectedYear, selectedMonth, 0);
  const dayMs = 24 * 60 * 60 * 1000;

  const weeklyAverageMap = salesStats.reduce((acc, week) => {
    const weekStart = new Date(`${week.date}T00:00:00`);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const rangeStart = weekStart < monthStartDate ? monthStartDate : weekStart;
    const rangeEnd = weekEnd > monthEndDate ? monthEndDate : weekEnd;
    const daysInRange =
      rangeStart <= rangeEnd
        ? Math.floor((rangeEnd - rangeStart) / dayMs) + 1
        : 0;

    acc[week.date] = daysInRange
      ? Math.round((week.total_amount || 0) / daysInRange)
      : 0;
    return acc;
  }, {});
  const lineData = {
    labels,
    datasets: [
      {
        label: "주별 매출 합계",
        data: totalSales,
        borderWidth: 3,
        borderColor: "#1d4ed8",
        backgroundColor: "rgba(29, 78, 216, 0.12)",
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.2,
      },
    ],
  };
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
        borderWidth: 3,
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        borderColor: "#2563eb",
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.25,
      },
    ],
  };

  const normalizedWeatherSeries = React.useMemo(() => {
    const buckets = {};
    const addToBucket = (summary, item) => {
      if (!buckets[summary]) {
        buckets[summary] = { summary, dataMap: {} };
      }
      const amount = item?.total_amount || 0;
      const monthKey = item?.month;
      if (!monthKey) return;
      buckets[summary].dataMap[monthKey] =
        (buckets[summary].dataMap[monthKey] || 0) + amount;
    };

    weatherMonthlySeries.forEach((series) => {
      const summary = weatherSummaryOptions.find((label) =>
        series.summary?.includes(label)
      );
      if (!summary) return;
      (series.data || []).forEach((item) => addToBucket(summary, item));
    });

    return Object.values(buckets).map((bucket) => ({
      category_type: "weather",
      summary: bucket.summary,
      data: Object.entries(bucket.dataMap)
        .map(([month, total_amount]) => ({ month, total_amount }))
        .sort((a, b) => a.month.localeCompare(b.month)),
    }));
  }, [weatherMonthlySeries, weatherSummaryOptions]);

  const displayWeatherSeries =
    weatherSummary === "all"
      ? normalizedWeatherSeries
      : normalizedWeatherSeries.filter(
          (series) => series.summary === weatherSummary
        );

  const weatherLabels = Array.from(
    new Set(
      displayWeatherSeries.flatMap((series) =>
        series.data?.map((item) => item.month) || []
      )
    )
  ).sort();

  const weatherColors = [
    "#0ea5e9",
    "#f97316",
    "#22c55e",
    "#a855f7",
    "#ef4444",
  ];

  const weatherMonthlyData = {
    labels: weatherLabels,
    datasets: displayWeatherSeries.map((series, index) => {
      const dataMap = (series.data || []).reduce((acc, item) => {
        acc[item.month] = item.total_amount || 0;
        return acc;
      }, {});
      return {
        label: series.summary || "날씨",
        data: weatherLabels.map((label) => dataMap[label] || 0),
        borderWidth: 3,
        borderColor: weatherColors[index % weatherColors.length],
        tension: 0.25,
      };
    }),
  };


  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 3,
      },
      point: {
        radius: 5,
        hoverRadius: 7,
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 15,
            weight: "600",
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 14,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 13,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 13,
          },
        },
      },
    },
  };

  const weeklyOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          afterBody: (tooltipItems) => {
            const index = tooltipItems?.[0]?.dataIndex ?? 0;
            const weekKey = labels[index];
            const weeklyAverage = weeklyAverageMap[weekKey] || 0;
            return `주 평균: ₩${currencyFormatter.format(weeklyAverage)}`;
          },
        },
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
            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
              <Card sx={{ borderLeft: "4px solid #1976d2", width: 200 }}>
                <CardHeader title="총 매출" />
                <CardContent>
                  <Typography variant="h5">
                    ₩{currencyFormatter.format(totalAmount)}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ borderLeft: "4px solid #1976d2", minWidth: 420 }}>
                <CardHeader title="이 달 주 평균 매출" />
                <CardContent>
                  <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                    <Box sx={{ minWidth: 160 }}>
                      <Typography variant="body2" color="text.secondary">
                        전체 주 평균
                      </Typography>
                      <Typography variant="h5">
                        ₩{currencyFormatter.format(weeklyAverageForMonth)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: 1,
                        maxHeight: 160,
                        overflowY: "auto",
                        flex: 1,
                        paddingRight: 1,
                      }}
                    >
                      {labels.length === 0 ? (
                        <Typography variant="body1" color="text.secondary">
                          주별 평균 매출 데이터가 없습니다.
                        </Typography>
                      ) : (
                        labels.map((label) => (
                          <Box key={label} sx={{ minWidth: 140 }}>
                            <Typography variant="body2" color="text.secondary">
                              {`${getWeekOfMonth(new Date(`${label}T00:00:00`))}주차`}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              ₩{currencyFormatter.format(weeklyAverageMap[label] || 0)}
                            </Typography>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
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
                  {loading ? "날씨 입력 중..." : "날씨 입력"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRecomputeStats}
                  disabled={loading}
                  sx={{ marginLeft: 1 }}
                >
                  통계 재계산
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
                    {SALE_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 150, marginLeft: 2 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="weather-summary-label">날씨 요약</InputLabel>
                  <Select
                    labelId="weather-summary-label"
                    value={weatherSummary}
                    label="날씨 요약"
                    onChange={(e) => setWeatherSummary(e.target.value)}
                  >
                    <MenuItem value="all">전체</MenuItem>
                    {weatherSummaryOptions.map((summary) => (
                      <MenuItem key={summary} value={summary}>
                        {summary}
                      </MenuItem>
                    ))}
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
                  <Box sx={{ height: 320, padding: 2 }}>
                    <Line data={lineData} options={weeklyOptions} />
                  </Box>
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
                  <Box sx={{ height: 320, padding: 2 }}>
                    <Line data={monthlyData} options={commonOptions} />
                  </Box>
                )}
              </Paper>
            </Box>

            <Box sx={{ marginTop: 3 }}>
              <div>
                <Typography variant="h5">
                  날씨별 월별 매출 추이
                </Typography>
                <Typography variant="h6">
                  날씨 요약별 월 매출 변화를 확인하세요.
                </Typography>
              </div>
              <Paper elevation={1}>
                {weatherLabels.length === 0 ? (
                  <Box sx={{ height: "50px" }} display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="h6">
                      날씨별 통계 데이터가 없습니다.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ height: 320, padding: 2 }}>
                    <Line data={weatherMonthlyData} options={commonOptions} />
                  </Box>
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
