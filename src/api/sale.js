const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function handleJsonResponse(resp) {
  if (!resp.ok) {
    const message = await resp.text();
    throw new Error(message || 'API 요청 실패');
  }
  return resp.json();
}

export async function fetchSales() {
  const resp = await fetch(`${API_BASE_URL}/sale`);
  return handleJsonResponse(resp);
}

export async function createSale(data) {
  const resp = await fetch(`${API_BASE_URL}/sale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleJsonResponse(resp);
}

export async function updateSale(id, data) {
  const resp = await fetch(`${API_BASE_URL}/sale/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleJsonResponse(resp);
}
