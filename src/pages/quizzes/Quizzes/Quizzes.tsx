import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Button, Table } from '../../../components';
import styles from './Quizzes.module.scss';
import { ReactComponent as ChevronIcon } from '../../../assets/images/chevron.svg';
import { Column } from 'react-table';
import { useMemo } from 'react';
import { Quiz } from '../../../services/models';

interface QuizzesData {
  level: number;
  content: string;
  answer: string;

  button: JSX.Element;
}

export default function Quizzes() {
  const quizzes: Quiz[] = [];
  const navigate = useNavigate();
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
    level: quiz.levelNumber,
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
