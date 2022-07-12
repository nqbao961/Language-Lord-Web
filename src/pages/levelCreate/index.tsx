import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from 'react-table';
import { Button, Input } from '../../components';
import styles from './LevelCreate.module.scss';
import { createLevel, getQuizzes } from '../../services/@redux/actions';
import {
  useAppDispatch,
  useAppSelector,
  useInput,
  useModalRef,
} from '../../services/hooks';
import QuizzesModal from './components/QuizzesModal';
import QuizzesTable from './components/QuizzesTable';

export default function LevelCreate() {
  const { t, i18n } = useTranslation();
  const addQuizModalRef = useModalRef();
  const [quizList, setQuizList] = useState<Row<object>[]>([]);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const { states: levelNumber, bind: bindLevelNumber } = useInput();

  const validate = () => {
    levelNumber.value === ''
      ? levelNumber.setError(t('Please enter a number'))
      : parseInt(levelNumber.value) <= 0
      ? levelNumber.setError(t('Invalid number'))
      : levelNumber.setError('');

    return levelNumber.value !== '' && parseInt(levelNumber.value) > 0;
  };

  const resetForm = () => {
    setQuizList([]);
    levelNumber.setValue('');
  };

  const submitLevel = () => {
    const quizIdsList = quizList.map(row => row.values.id as string);

    if (validate()) {
      dispatch(
        createLevel({
          levelNumber: parseInt(levelNumber.value),
          quizList: quizIdsList,
          language: user.preferedLang,
        })
      ).then(() => {
        dispatch(getQuizzes({ notInLevel: true }));
        resetForm();
      });
    }
  };

  useEffect(() => {
    dispatch(getQuizzes({ notInLevel: true }));
    resetForm();
  }, [dispatch, user.preferedLang]);

  return (
    <div className={styles.container}>
      <h1>{t('Create Level')}</h1>
      <Button
        className={styles.addButton}
        label={t('Add Quizzes')}
        handleClick={() => addQuizModalRef.current!.showModal()}
      />
      <QuizzesModal
        addQuizModalRef={addQuizModalRef}
        setQuizList={setQuizList}
      />
      <Input id="info" type="number" label={t('Level')} {...bindLevelNumber} />
      {quizList.length > 0 ? (
        <>
          <QuizzesTable quizList={quizList} setQuizList={setQuizList} />
          <div className={styles.buttonWrapper}>
            <Button label={t('Cancel')} type="transparent" />
            <Button label={t('Create')} handleClick={() => submitLevel()} />
          </div>
        </>
      ) : (
        <p>{t('Please add quizzes')}</p>
      )}
    </div>
  );
}
