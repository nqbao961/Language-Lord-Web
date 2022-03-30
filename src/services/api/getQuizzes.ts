import axios from 'axios';

const url = 'http://localhost:5000/quiz';

export const getQuizzes = () => axios.get(url);
