import { User, UserUpdate } from '../models';
import { instance } from './config';
import { APIResponse } from './type';

export const getProfile = (): APIResponse<User> =>
  instance().request({
    url: `/profile`,
    method: 'GET',
  });

export const updateUser = (user: UserUpdate): APIResponse<User> =>
  instance().request({
    url: `/users`,
    method: 'PATCH',
    data: user,
  });

export const getRank = (): APIResponse<{ en: User[]; vi: User[] }> =>
  instance().request({
    url: `/users/rank`,
    method: 'GET',
  });
