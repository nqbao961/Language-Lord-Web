import { AxiosResponse } from 'axios';
import { instance } from './config';

type APIResponse<T> = Promise<AxiosResponse<T, any>>;

export const googleRedirect = (redirectParams: string): APIResponse<any> =>
  instance.request({
    url: '/google/redirect' + redirectParams,
    method: 'GET',
  });
