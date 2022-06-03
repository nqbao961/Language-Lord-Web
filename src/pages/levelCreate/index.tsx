import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from 'react-table';
import { Button } from '../../components';
import styles from './LevelCreate.module.scss';
import { getQuizzes } from '../../services/@redux/actions';
import { useAppDispatch, useModalRef } from '../../services/hooks';
import QuizzesModal from './components/QuizzesModal';
import QuizzesTable from './components/QuizzesTable';

export default function LevelCreate() {
  const { t, i18n } = useTranslation();
  const addQuizModalRef = useModalRef();
  const [quizList, setQuizList] = useState<Row<object>[]>([]);
  const dispatch = useAppDispatch();

  const submitLevel = () => {
    const quizIdsList = quizList.map(row => row.values.id);
    console.log(quizIdsList);
  };

  useEffect(() => {
    dispatch(getQuizzes());
  }, [dispatch]);

  return (
    <div>
      <h1>{t('Create Level')}</h1>
      <Button
        label={t('Add Quizzes')}
        handleClick={() => addQuizModalRef.current!.showModal()}
      />
      <QuizzesModal
        addQuizModalRef={addQuizModalRef}
        setQuizList={setQuizList}
      />
      {quizList.length > 0 && (
        <>
          <QuizzesTable quizList={quizList} setQuizList={setQuizList} />
          <Button
            className={styles.submitButton}
            label={t('Create')}
            handleClick={() => submitLevel()}
          />
        </>
      )}
    </div>
  );
}
