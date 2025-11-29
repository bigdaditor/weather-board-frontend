import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/weatherboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

function StatsPage() {
  const [loading, setLoading] = useState(false);
  const [salesStats, setSalesStats] = useState([]);

  const fetchStats = async () => {
    try {
      const resp = await fetch('/stats/sales'); // 실제 엔드포인트에 맞게 수정
      if (!resp.ok) throw new Error('통계 조회 실패');
      const data = await resp.json();
      setSalesStats(data);
    } catch (err) {
      console.error(err);
      alert('통계 데이터 불러오다가 에러났음.');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSync = async () => {
    try {
      setLoading(true);
      // 날씨-매출 동기화 트리거 가정
      await fetch('/sync/weather', { method: 'POST' });
      await fetchStats();
    } catch (err) {
      console.error(err);
      alert('동기화 중 에러.');
    } finally {
      setLoading(false);
    }
  };

  const labels = salesStats.map((d) => d.date);
  const totalSales = salesStats.map((d) => d.total_amount);
  const avgTemp = salesStats.map((d) => d.avg_temp);

  const lineData = {
    labels,
    datasets: [
      {
        label: '매출액',
        data: totalSales,
        borderWidth: 2,
        tension: 0.2,
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: '평균 기온(°C)',
        data: avgTemp,
        borderWidth: 1,
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
    <div>
      <h2 className="wb-page-title">통계</h2>

      <div className="wb-toolbar">
        <span>매출 / 날씨 동기화</span>
        <Button variant="contained" onClick={handleSync} disabled={loading}>
          {loading ? '동기화 중...' : '동기화'}
        </Button>
      </div>

      <div className="wb-card">
        <h3 style={{ marginBottom: 8 }}>일별 매출 추이</h3>
        <Line data={lineData} options={commonOptions} />
      </div>

      <div className="wb-card">
        <h3 style={{ marginBottom: 8 }}>일별 평균 기온</h3>
        <Bar data={barData} options={commonOptions} />
      </div>
    </div>
  );
}

export default StatsPage;