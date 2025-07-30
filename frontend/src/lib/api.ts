import axios from 'axios';

// Configuração base da API com validação de protocolo
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Garantir que sempre use https:// em produção
export const API_BASE_URL = rawApiUrl.startsWith('http://') || rawApiUrl.startsWith('https://') 
  ? rawApiUrl 
  : `https://${rawApiUrl}`;

// Log para debug - será removido depois
console.log('🔧 Raw API URL:', rawApiUrl);
console.log('🔧 Final API_BASE_URL:', API_BASE_URL);
console.log('🔧 Environment:', process.env.NODE_ENV);

// Instância do axios configurada
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
