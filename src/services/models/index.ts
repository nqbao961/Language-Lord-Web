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
