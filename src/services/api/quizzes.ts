import { Quiz, QuizCreate } from '../models';
import { getLang, instance } from './config';
import { APIResponse, getQuizzesParams } from './type';

export const getQuizzes = (params?: getQuizzesParams): APIResponse<Quiz[]> =>
  instance.request({
    url: '/quizzes',
    method: 'GET',
    params: { lang: getLang(), ...(params && params) },
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
