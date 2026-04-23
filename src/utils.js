import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'token';
const USER_KEY = 'parking-user';

export const saveSession = (payload) => {
  localStorage.setItem(TOKEN_KEY, payload.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    }),
  );
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getUser = () => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      clearSession();
      return null;
    }

    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return {
      name: decoded.name,
      email: decoded.sub,
      role: decoded.role,
    };
  } catch {
    clearSession();
    return null;
  }
};

export const logout = () => {
  clearSession();
  window.location.href = '/login';
};
