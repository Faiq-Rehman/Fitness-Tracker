export const USER_AUTH_KEY = 'fittrack_user_auth';
export const USER_TOKEN_KEY = 'fittrack_user_token';
export const USER_NAME_KEY = 'fittrack_user_name';
export const USER_PIC_KEY = 'fittrack_user_pic';
export const ADMIN_AUTH_KEY = 'fittrack_admin_auth';
export const ADMIN_TOKEN_KEY = 'fittrack_admin_token';

export function isUserLoggedIn() {
  return Boolean(localStorage.getItem(USER_TOKEN_KEY));
}

export function isAdminLoggedIn() {
  return Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));
}

export function loginUser(userOrName = 'User', token = '') {
  if (token) {
    localStorage.setItem(USER_TOKEN_KEY, token);
    localStorage.setItem(USER_AUTH_KEY, 'true');
  }

  const name = typeof userOrName === 'string'
    ? userOrName
    : userOrName?.fullName || userOrName?.username || userOrName?.email || 'User';

  localStorage.setItem(USER_NAME_KEY, name);

  if (typeof userOrName === 'object' && userOrName !== null) {
    if (userOrName.profilePicture) {
      localStorage.setItem(USER_PIC_KEY, userOrName.profilePicture);
    } else if (userOrName.profilePicture === '') {
      localStorage.removeItem(USER_PIC_KEY);
    }
  }
}

export function logoutUser() {
  localStorage.removeItem(USER_AUTH_KEY);
  localStorage.removeItem(USER_TOKEN_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(USER_PIC_KEY);
}

export function getUserProfilePicture() {
  return localStorage.getItem(USER_PIC_KEY) || '';
}

export function getUserToken() {
  return localStorage.getItem(USER_TOKEN_KEY);
}

export function getUserAuthHeader() {
  const token = getUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getUserInitials() {
  const name = localStorage.getItem(USER_NAME_KEY) || 'User';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'US';
}

export function loginAdmin(token) {
  localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminAuthHeader() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getAuthHeader() {
  return getAdminAuthHeader();
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getUserAuthHeader(),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // response body empty or not JSON
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}