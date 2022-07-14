import { User } from '../models';
import { instance } from './config';
import { APIResponse } from './type';

export const googleRedirect = (
  redirectParams: string
): APIResponse<{ token: string; user: User }> =>
  instance().request({
    url: '/google/redirect' + redirectParams,
    method: 'GET',
  });
