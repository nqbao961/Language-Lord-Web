import { AxiosResponse } from 'axios';

export type APIResponse<T> = Promise<AxiosResponse<T, any>>;

export type getQuizzesParams = {
  notInLevel?: boolean;
};
