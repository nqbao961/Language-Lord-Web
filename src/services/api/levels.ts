import { Level, LevelCreate } from '../models';
import { getLang, instance } from './config';
import { APIResponse } from './type';

export const getLevels = (): APIResponse<Level[]> =>
  instance().request({
    url: '/levels',
    method: 'GET',
    params: { lang: getLang() },
  });

export const getLevel = (id: string): APIResponse<Level> =>
  instance().request({
    url: `/levels/${id}`,
    method: 'GET',
  });

export const getLevelTotal = (): APIResponse<{ en: number; vi: number }> =>
  instance().request({
    url: `/levels/total`,
    method: 'GET',
  });

export const createLevel = (level: LevelCreate): APIResponse<Level> =>
  instance().request({
    url: '/levels',
    method: 'POST',
    data: level,
    params: { lang: getLang() },
  });

export const updateLevel = (
  id: string,
  level: LevelCreate
): APIResponse<Level> =>
  instance().request({
    url: `/levels/${id}`,
    method: 'PUT',
    data: level,
  });

export const deleteLevel = (id: string): APIResponse<any> =>
  instance().request({
    url: `/levels/${id}`,
    method: 'DELETE',
  });
