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
  avatar: string;
  preferedLang: 'en' | 'vi';
  level: { vie: number; eng: number };
  score: { vie: number; eng: number };
  hint: { vie: number; eng: number };
  completedQuizzes: { vie: string[]; eng: string[] };
}

interface QuizProp {
  _id: string;
  content: string;
  answer: string;
  explaination?: string;
  info?: string;
  levelId?: string;
  levelNumber?: number;
}

export type Quiz = (
  | {
      type: 'shuffleLetters' | 'shuffleIdiom';
    }
  | {
      type: 'fillIdiom';
      choices: string[];
    }
) &
  QuizProp;

export type QuizCreate = Omit<Quiz, '_id' | 'levelId' | 'levelNumber'> & {
  choices?: string[];
};

export interface Level {
  _id: string;
  levelNumber: number;
  quizIds: string[];
}
