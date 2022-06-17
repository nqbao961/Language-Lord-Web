export interface Location {
  pathname: string;
  search: string;
  hash: string;
  state: any;
  key: string;
}

export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  preferedLang: 'en' | 'vi';
  level: { vi: number; en: number };
  score: { vi: number; en: number };
  hint: { vi: number; en: number };
  completedQuizzes: { vi: Quiz['_id'][]; en: Quiz['_id'][] };
}

interface QuizProp {
  _id: string;
  content: string;
  answer: string;
  explaination?: string;
  info?: string;
  levelId?: string;
  levelNumber?: number;
  language: 'en' | 'vi';
}

export type Quiz = (
  | {
      type: 'shuffleLetters' | 'shuffleIdiom';
    }
  | {
      type: 'multipleChoice';
      choices: string[];
    }
) &
  QuizProp;

export type QuizCreate = Omit<Quiz, '_id' | 'levelId' | 'levelNumber'> & {
  choices?: string[];
};

export interface LevelCreate {
  levelNumber: number;
  quizList: string[];
  language: 'en' | 'vi';
}

export interface Level {
  _id: string;
  levelNumber: number;
  quizList: Quiz[];
  language: 'en' | 'vi';
}

export interface TypedAction<T = any> {
  type: string;
  payload: T;
}
