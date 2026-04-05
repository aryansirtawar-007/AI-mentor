const API_BASE = '/api';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

export const api = {
  auth: {
    signup: (data: any) => fetchWithAuth('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) => fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: () => fetchWithAuth('/auth/me'),
  },
  career: {
    analyze: (data: any) => fetchWithAuth('/career/analyze', { method: 'POST', body: JSON.stringify(data) }),
    getPlan: () => fetchWithAuth('/career/plan'),
  },
  chat: {
    sendMessage: (message: string) => fetchWithAuth('/chat', { method: 'POST', body: JSON.stringify({ message }) }),
    getHistory: () => fetchWithAuth('/chat/history'),
    clearHistory: () => fetchWithAuth('/chat/history', { method: 'DELETE' }),
  }
};
