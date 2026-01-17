const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function handleJsonResponse(resp) {
  if (!resp.ok) {
    const message = await resp.text();
    throw new Error(message || 'API 요청 실패');
  }
  return resp.json();
}

async function fetchWeather(month) {
  const qs = month ? `?month=${encodeURIComponent(month)}` : '';
  const resp = await fetch(`${API_BASE_URL}/weather${qs}`);
  return handleJsonResponse(resp);
}

export { fetchWeather };
