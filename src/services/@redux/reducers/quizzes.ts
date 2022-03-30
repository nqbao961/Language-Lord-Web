export default (quizzes = [], action: any) => {
  switch (action.type) {
    case 'GET_ALL':
      return action.payload;
    case 'CREATE':
      return quizzes;
    default:
      return quizzes;
  }
};
