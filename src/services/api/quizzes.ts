import { Quiz, QuizCreate } from '../models';
import { instance } from './config';

export const getQuizzes = () =>
  instance.request({
    url: '/quizzes',
    method: 'GET',
  });

export const createQuiz = (quiz: QuizCreate) =>
  instance.request({
    url: '/quizzes',
    method: 'POST',
    data: quiz,
  });
