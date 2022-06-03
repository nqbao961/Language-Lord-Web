import { AxiosResponse } from 'axios';
import { Quiz, QuizCreate } from '../models';
import { instance } from './config';

type APIResponse<T> = Promise<AxiosResponse<T, any>>;

export const getQuizzes = (): APIResponse<Quiz[]> =>
  instance.request({
    url: '/quizzes',
    method: 'GET',
  });

export const getQuiz = (id: string): APIResponse<Quiz> =>
  instance.request({
    url: `/quizzes/${id}`,
    method: 'GET',
  });

export const createQuiz = (quiz: QuizCreate): APIResponse<Quiz> =>
  instance.request({
    url: '/quizzes',
    method: 'POST',
    data: quiz,
  });

export const updateQuiz = (id: string, quiz: QuizCreate): APIResponse<Quiz> =>
  instance.request({
    url: `/quizzes/${id}`,
    method: 'PUT',
    data: quiz,
  });

export const deleteQuiz = (id: string): APIResponse<any> =>
  instance.request({
    url: `/quizzes/${id}`,
    method: 'DELETE',
  });
