import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Button, Table } from '../../../components';
import styles from './Levels.module.scss';
import { ReactComponent as ChevronIcon } from '../../../assets/images/chevron.svg';
import { Column } from 'react-table';
import { useEffect, useMemo } from 'react';
import { Level } from '../../../services/models';
import { useAppDispatch, useAppSelector } from '../../../services/hooks';
import { getLevels } from '../../../services/@redux/actions';
import { TFunction, useTranslation } from 'react-i18next';

interface LevelzesData {
  levelNo: string;
  quizzes: JSX.Element;

  button: JSX.Element;
}

export default function Levels() {
  const dispatch = useAppDispatch();
  const levels = useAppSelector(state => state.levels);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    dispatch(getLevels());
  }, [dispatch]);

  const columns: Column[] = useMemo(() => createColumns(t), []);
  const data: LevelzesData[] = useMemo(
    () => createRowsData(levels, navigate),
    [levels]
  );

  const goToCreateLevel = () => {
    navigate('../create-level');
  };

  return (
    <div>
      <h1>{t('Levels')}</h1>
      <Button
        className={styles.createButton}
        kind="fab"
        label={<i className="fa-solid fa-grid-2-plus"></i>}
        handleClick={goToCreateLevel}
      />
      <Table columns={columns} data={data} rowClick pageInput />
    </div>
  );
}

function createColumns(t: TFunction<'translation', undefined>) {
  return [
    {
      Header: t('Level'),
      accessor: 'level',
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

function createRowsData(
  levels: Level[],
  navigate: NavigateFunction
): LevelzesData[] {
  return levels.map(level => ({
    levelNo: level.levelNumber?.toString() || '-',
    quizzes: <div className={styles.breakLine}>{level.quizzes}</div>,
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
