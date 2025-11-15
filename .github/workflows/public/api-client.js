// Cliente para consumir el Worker D1 API
// Usage: window.API_CLIENT.login(email,password) etc.

const API_BASE = 'https://databasecloudflaretienda.lhmolam-877.workers.dev'; // <-- tu Worker

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers || {};
  headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/${path}`, { ...options, headers });
  const text = await res.text();
  let json = {};
  try { json = text ? JSON.parse(text) : {}; } catch(e) { json = { raw: text }; }
  if (!res.ok) throw new Error(json.error || (json.message ? json.message : `HTTP ${res.status}`));
  return json;
}

async function registerClient(name, email, password) {
  return apiFetch('register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
}

async function loginClient(email, password) {
  const data = await apiFetch('login', { method: 'POST', body: JSON.stringify({ email, password }) });
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

function logoutClient() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

async function getProductsClient() {
  const data = await apiFetch('products', { method: 'GET' });
  return data.products || [];
}

async function createProductClient(product) {
  return apiFetch('products', { method: 'POST', body: JSON.stringify(product) });
}

async function createOrderClient(items, total, delivery_address) {
  return apiFetch('orders', { method: 'POST', body: JSON.stringify({ items, total, delivery_address }) });
}

async function getOrdersClient() {
  const data = await apiFetch('orders', { method: 'GET' });
  return data.orders || [];
}

async function forceSyncClient() {
  return apiFetch('sync', { method: 'GET' });
}

window.API_CLIENT = {
  registerClient,
  loginClient,
  logoutClient,
  getProductsClient,
  createProductClient,
  createOrderClient,
  getOrdersClient,
  forceSyncClient
};
