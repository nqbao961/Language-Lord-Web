import { AxiosResponse } from 'axios';
import { Level, LevelCreate } from '../models';
import { instance, lang } from './config';

type APIResponse<T> = Promise<AxiosResponse<T, any>>;

export const getLevels = (): APIResponse<Level[]> =>
  instance.request({
    url: '/levels',
    method: 'GET',
    params: { lang },
  });

export const getLevel = (id: number): APIResponse<Level> =>
  instance.request({
    url: `/levels/${id}`,
    method: 'GET',
  });

export const createLevel = (level: LevelCreate): APIResponse<Level> =>
  instance.request({
    url: '/levels',
    method: 'POST',
    data: level,
  });

export const updateLevel = (
  id: string,
  level: LevelCreate
): APIResponse<Level> =>
  instance.request({
    url: `/levels/${id}`,
    method: 'PUT',
    data: level,
  });

export const deleteLevel = (id: string): APIResponse<any> =>
  instance.request({
    url: `/levels/${id}`,
    method: 'DELETE',
  });
