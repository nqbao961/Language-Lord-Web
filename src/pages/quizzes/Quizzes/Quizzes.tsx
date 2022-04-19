import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Button, Table } from '../../../components';
import styles from './Quizzes.module.scss';
import { ReactComponent as ChevronIcon } from '../../../assets/images/chevron.svg';
import { Column } from 'react-table';
import { useEffect, useMemo } from 'react';
import { Quiz } from '../../../services/models';
import { useAppDispatch, useAppSelector } from '../../../services/hooks';
import { getQuizzes } from '../../../services/@redux/actions/quizzes';

interface QuizzesData {
  level: string;
  content: string;
  answer: string;

  button: JSX.Element;
}

export default function Quizzes() {
  const dispatch = useAppDispatch();
  const test = useAppSelector(state => state.quizzes);
  console.log(test);

  const quizzes: Quiz[] = [];
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getQuizzes());
  }, [dispatch]);

  const columns: Column[] = useMemo(() => createColumns(), []);
  const data: QuizzesData[] = useMemo(
    () => createRowsData(quizzes, navigate),
    [quizzes]
  );

  const goToCreateQuiz = () => {
    navigate('../create-quiz');
  };

  return (
    <div>
      <h1>Quizzes</h1>
      <Button
        className={styles.createButton}
        kind="fab"
        label={<i className="fa-solid fa-grid-2-plus"></i>}
        handleClick={goToCreateQuiz}
      />
      <Table columns={columns} data={data} rowClick pageInput />
    </div>
  );
}

function createColumns() {
  return [
    {
      Header: 'Level',
      accessor: 'level',
    },
    {
      Header: 'Content',
      accessor: 'content',
    },
    {
      Header: 'Answer',
      accessor: 'answer',
    },
    {
      Header: '',
      accessor: 'button',
    },
  ];
}

function createRowsData(
  quizzes: Quiz[],
  navigate: NavigateFunction
): QuizzesData[] {
  return quizzes.map(quiz => ({
    level: quiz.levelNumber?.toString() || '-',
    content: quiz.content,
    answer: quiz.answer,
    button: (
      <div
        className={styles.buttonCell}
        onClick={e => {
          if (e) {
            e.stopPropagation();
          }
        }}
      >
        <ChevronIcon
          style={{ stroke: 'var(--primary)', transform: 'rotate(-90deg)' }}
        />
      </div>
    ),
  }));
}
