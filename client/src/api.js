const raw = import.meta.env.VITE_API_URL || '';
const API_BASE = raw.startsWith('http://') || raw.startsWith('https://')
  ? raw.replace(/\/$/, '')
  : 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token');
}

export async function api(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export { API_BASE };
