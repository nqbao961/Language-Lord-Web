import styles from './Play.module.scss';
import Profile from './components/Profile';
import ScoreHint from './components/ScoreHint';
import Rank from './components/Rank';
import Setting from './components/Setting';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { Button } from '../../components';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Ready from './components/Ready';
import { PlayState } from './type';
import { getLevel } from '../../services/@redux/actions';
import Playing from './components/Playing';
import { Level } from '../../services/models';

export default function Play() {
  const [playState, setPlayState] = useState<PlayState>('selectLevel');
  const [countDown, setCountDown] = useState(0);
  const [intervalId, setIntervalId] = useState<any>(0);
  const [currentLevel, setCurrentLevel] = useState<Level>();

  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  const onClickPlayLevel = () => {
    dispatch(getLevel(user.level.en)).then(level => {
      console.log(level);
      setCurrentLevel(level);
      setCountDown(3);
      setPlayState('ready');
      const timer = setInterval(() => {
        setCountDown(countDown => countDown - 1);
      }, 1000);
      setIntervalId(timer);
    });
  };

  useEffect(() => {
    countDown === -1 && clearInterval(intervalId);
  }, [countDown]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerWrapper}>
          <Profile />
          <ScoreHint />
        </div>
        <div className={styles.headerWrapper}>
          <Rank />
          <Setting />
        </div>
      </div>

      <div className={styles.mainContent}>
        {playState === 'selectLevel' && (
          <Button
            className={styles.playLevelButton}
            label={`${t('Level')} ${user.level.en}`}
            handleClick={onClickPlayLevel}
          />
        )}
        {playState === 'ready' && (
          <Ready countDown={countDown} setPlayState={setPlayState} />
        )}
        {playState === 'playing' && currentLevel && (
          <Playing level={currentLevel} />
        )}
      </div>
    </div>
  );
}
