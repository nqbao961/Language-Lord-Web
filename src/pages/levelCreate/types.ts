export interface QuizData {
  index: JSX.Element;
  id: string;
  content: string;
  answer: string;
  type: string;
  button: JSX.Element;
}

export interface AllQuizzesData {
  id: string;
  content: string;
  answer: string;
  type: string;
}
