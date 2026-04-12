// ============================================================
//  Sahu Store — API Service Layer
// ============================================================
const API_BASE = 'http://localhost:5000/api';

// ─── Helpers ───────────────────────────────────────────────
const getToken = () => localStorage.getItem('shopzen_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// ─── Auth API ───────────────────────────────────────────────
const AuthAPI = {
  register: (body) =>
    fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  login: (body) =>
    fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  getProfile: () =>
    fetch(`${API_BASE}/auth/profile`, { headers: authHeaders() }).then(handleResponse),
  updateProfile: (body) =>
    fetch(`${API_BASE}/auth/profile`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),
};

// ─── Products API ───────────────────────────────────────────
const ProductsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/products?${qs}`, { headers: authHeaders() }).then(handleResponse);
  },
  getFeatured: () =>
    fetch(`${API_BASE}/products/featured`, { headers: authHeaders() }).then(handleResponse),
  getById: (id) =>
    fetch(`${API_BASE}/products/${id}`, { headers: authHeaders() }).then(handleResponse),
  addReview: (id, body) =>
    fetch(`${API_BASE}/products/${id}/reviews`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),
};

// ─── Orders API ─────────────────────────────────────────────
const OrdersAPI = {
  create: (body) =>
    fetch(`${API_BASE}/orders`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  getMyOrders: () =>
    fetch(`${API_BASE}/orders/myorders`, { headers: authHeaders() }).then(handleResponse),
  getById: (id) =>
    fetch(`${API_BASE}/orders/${id}`, { headers: authHeaders() }).then(handleResponse),
};
