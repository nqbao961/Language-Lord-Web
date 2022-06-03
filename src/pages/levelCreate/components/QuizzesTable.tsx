import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row } from 'react-table';
import { Table } from '../../../components';
import styles from '../LevelCreate.module.scss';
import { QuizData } from '../types';

type QuizzesTableProps = {
  quizList: Row<object>[];
  setQuizList: React.Dispatch<React.SetStateAction<Row<object>[]>>;
};

export default function QuizzesTable({
  quizList,
  setQuizList,
}: QuizzesTableProps) {
  const { t, i18n } = useTranslation();

  const selectedQuizzesColumns: Column[] = useMemo(
    () => createQuizColumns(),
    []
  );
  const selectedQuizzesData: QuizData[] = useMemo(
    () => createQuizData(quizList, setQuizList),
    [quizList]
  );

  function createQuizColumns() {
    return [
      {
        Header: '',
        accessor: 'index',
      },
      {
        Header: t('Content'),
        accessor: 'content',
      },
      {
        Header: t('Answer'),
        accessor: 'answer',
      },
      {
        Header: '',
        accessor: 'button',
      },
    ];
  }

  function createQuizData(
    quizList: Row<object>[],
    setQuizList: React.Dispatch<React.SetStateAction<any[]>>
  ): QuizData[] {
    return quizList.map((quiz, index, quizList) => ({
      index: <span>{index + 1}</span>,
      id: quiz.values._id,
      content: quiz.values.content,
      answer: quiz.values.answer,
      button: (
        <div
          className={styles.buttonCell}
          onClick={() => {
            quiz.toggleRowSelected(false);
            setQuizList(quizList.filter((item, i) => i !== index));
          }}
        >
          <i className="fa-solid fa-trash-can"></i>
        </div>
      ),
    }));
  }

  return (
    <div className={styles.centresWrapper}>
      <Table
        hiddenColumns={['id']}
        minWidth={500}
        columns={selectedQuizzesColumns}
        data={selectedQuizzesData}
      />
    </div>
  );
}
