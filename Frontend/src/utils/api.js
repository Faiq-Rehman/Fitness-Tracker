import { getUserAuthHeader } from './auth.js';

const API_BASE = '/api';

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('/api') ? path : `${API_BASE}${path}`;
  const { method = 'GET', headers = {}, body, ...rest } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getUserAuthHeader(),
      ...headers,
    },
    ...rest,
  };

  if (body !== undefined && body !== null) {
    config.body = body;
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || response.statusText || 'Network response was not ok');
  }

  return data;
}

