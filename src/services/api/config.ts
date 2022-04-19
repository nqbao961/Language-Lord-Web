import axios from 'axios';

const token = localStorage.getItem('token');

export const instance = axios.create({
  baseURL: 'http://localhost:5000/',
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});
