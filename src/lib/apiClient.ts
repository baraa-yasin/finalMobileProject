import { create } from 'axios';

export const apiClient = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
