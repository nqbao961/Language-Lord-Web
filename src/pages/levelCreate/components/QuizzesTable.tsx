import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row } from 'react-table';
import { Table } from '../../../components';
import { Quiz } from '../../../services/models';
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
    [i18n.language]
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
        Header: t('Type'),
        accessor: 'type',
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
    return quizList.map((quizRow, index, quizList) => {
      const quiz = quizRow.values as Quiz;
      const typeString = () => {
        switch (quiz.type) {
          case 'shuffleLetters':
            return t('Shuffle Letters');
          case 'shuffleIdiom':
            return t('Shuffle Idiom');
          case 'multipleChoice':
            return t('Multiple Choice');
          default:
            return '-';
        }
      };

      return {
        index: <span>{index + 1}</span>,
        id: quiz._id,
        content: quiz.content,
        answer: quiz.answer,
        type: typeString(),
        button: (
          <div
            className={styles.buttonCell}
            onClick={() => {
              quizRow.toggleRowSelected(false);
              setQuizList(quizList.filter((item, i) => i !== index));
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </div>
        ),
      };
    });
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
