// Authentication utilities for CutList Cloud frontend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  name?: string;
  tier: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Token management
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// API helper with auth
export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
};

// Auth functions
export const register = async (
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Registration failed');
  }
  
  const data: AuthResponse = await response.json();
  setToken(data.access_token);
  return data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }
  
  const data: AuthResponse = await response.json();
  setToken(data.access_token);
  return data;
};

export const logout = (): void => {
  removeToken();
  window.location.href = '/';
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const response = await fetchWithAuth('/api/auth/me');
    if (!response.ok) {
      removeToken();
      return null;
    }
    return response.json();
  } catch {
    return null;
  }
};

// Billing functions
export const createCheckout = async (tier: string): Promise<string> => {
  const response = await fetchWithAuth('/api/billing/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Checkout failed');
  }
  
  const data = await response.json();
  return data.url;
};

export const createPortal = async (): Promise<string> => {
  const response = await fetchWithAuth('/api/billing/portal', {
    method: 'POST',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Portal failed');
  }
  
  const data = await response.json();
  return data.url;
};

export const getTiers = async () => {
  const response = await fetch(`${API_URL}/api/billing/tiers`);
  return response.json();
};

export const getUsage = async () => {
  const response = await fetchWithAuth('/api/projects/usage/me');
  return response.json();
};
