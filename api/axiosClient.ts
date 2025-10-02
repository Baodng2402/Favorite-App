import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor ví dụ: tự động log error
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
