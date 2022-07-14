import axios from 'axios';
import { store } from '../@redux/store';
import { selectEnv } from '../env';

export const baseURL = selectEnv({
  dev: 'http://localhost:5000',
  staging: 'https://language-lord-api.herokuapp.com',
  prod: 'https://language-lord-api.herokuapp.com',
});

export const instance = () => {
  const token = localStorage.getItem('token');

  return axios.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const getLang = () => store.getState().user.preferedLang;
