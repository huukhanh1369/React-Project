import axios from 'axios';
import type { AxiosInstance } from 'axios'

const API_BASE_URL = 'http://localhost:3000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;