const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function handleJsonResponse(resp) {
  if (!resp.ok) {
    const message = await resp.text();
    throw new Error(message || 'API 요청 실패');
  }
  return resp.json();
}

async function fetchSales(page, page_size) {
  let url = `${API_BASE_URL}/sale`;
  const params = [];
  if (page != null) params.push(`page=${page}`);
  if (page_size != null) params.push(`page_size=${page_size}`);
  if (params.length) url += `?${params.join('&')}`;
  const resp = await fetch(url);
  return handleJsonResponse(resp);
}

async function fetchSalesByMonth(monthKey) {
  // monthKey expected as YYYY-MM
  const url = `${API_BASE_URL}/sale/month/?key=${encodeURI(monthKey)}`;
  const resp = await fetch(url);
  return handleJsonResponse(resp);
}

async function createSale(data) {
  const resp = await fetch(`${API_BASE_URL}/sale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleJsonResponse(resp);
}

async function updateSale(data) {
  const resp = await fetch(`${API_BASE_URL}/sale`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleJsonResponse(resp);
}

async function deleteSale(data) {
  const resp = await fetch(`${API_BASE_URL}/sale`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || '삭제 실패');
  }
  return true;
}

export { fetchSales, fetchSalesByMonth, createSale, updateSale, deleteSale }