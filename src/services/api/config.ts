import axios from 'axios';
import { store } from '../@redux/store';

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

export const getLang = () => store.getState().user.preferedLang;
