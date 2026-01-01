const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function handleJsonResponse(resp) {
  if (!resp.ok) {
    const message = await resp.text();
    throw new Error(message || 'API 요청 실패');
  }
  return resp.json();
}

async function fetchStatistics(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') qs.append(k, v);
  });
  const url = `${API_BASE_URL}/statistics${qs.toString() ? `?${qs.toString()}` : ''}`;
  const resp = await fetch(url);
  return handleJsonResponse(resp);
}

async function fetchStatisticsSummary(periodType = 'month', payment_type = 'all') {
  const url = `${API_BASE_URL}/statistics/summary/${encodeURIComponent(periodType)}?payment_type=${encodeURIComponent(
    payment_type
  )}`;
  const resp = await fetch(url);
  return handleJsonResponse(resp);
}

export { fetchStatistics, fetchStatisticsSummary };
