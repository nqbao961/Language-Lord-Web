import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row } from 'react-table';
import { Table, Modal } from '../../../components';
import { TModalRef, useAppSelector } from '../../../services/hooks';
import { Quiz } from '../../../services/models';
import { AllQuizzesData } from '../types';

type QuizzesModalProps = {
  addQuizModalRef: TModalRef;
  setQuizList: React.Dispatch<React.SetStateAction<Row<object>[]>>;
};

export default function QuizzesModal({
  addQuizModalRef,
  setQuizList,
}: QuizzesModalProps) {
  const { t, i18n } = useTranslation();

  const [selectingQuizzes, setSelectingQuizzes] = useState<Row<object>[]>([]);
  const quizzes = useAppSelector(state => state.quizzes);

  const allQuizzesColumns: Column[] = useMemo(
    () => createAllQuizzesColumns(),
    [i18n.language]
  );
  const allQuizzesData: AllQuizzesData[] = useMemo(
    () => createAllQuizzesData(quizzes),
    [quizzes]
  );

  function createAllQuizzesColumns() {
    return [
      {
        Header: 'id',
        accessor: 'id',
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
    ];
  }

  function createAllQuizzesData(allQuizzes: Quiz[]): AllQuizzesData[] {
    return allQuizzes.map(quiz => {
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
        id: quiz._id,
        content: quiz.content,
        answer: quiz.answer,
        type: typeString(),
      };
    });
  }

  const quizzesTableEl = useMemo(
    () => (
      <Table
        columns={allQuizzesColumns}
        data={allQuizzesData}
        pageNumber={allQuizzesData.length}
        hiddenColumns={['id']}
        tableMaxHeight="50vh"
        minWidth={500}
        rowSelect
        handleSelectRow={(selectedFlatRows, selectedRowIds) => {
          const curQuizIds = selectingQuizzes.map(c => c.id);
          const curQuizzes = selectingQuizzes.filter(c =>
            Object.keys(selectedRowIds).includes(c.id)
          );
          const newQuizzes = selectedFlatRows.filter(
            c => !curQuizIds.includes(c.id)
          );
          const mergedQuizzes = [...curQuizzes, ...newQuizzes];
          selectingQuizzes.length !== mergedQuizzes.length &&
            setSelectingQuizzes(mergedQuizzes);
        }}
      />
    ),
    [allQuizzesColumns, allQuizzesData, selectingQuizzes]
  );

  return (
    <Modal
      ref={addQuizModalRef}
      header={t('Select quizzes')}
      body={quizzesTableEl}
      keepAlive
      handleOkay={() => {
        setQuizList(selectingQuizzes);
      }}
    />
  );
}
