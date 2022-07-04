import { useTranslation } from 'react-i18next';
import ribbonStars from '../../../assets/images/ribbon-stars.png';
import ribbonNoStars from '../../../assets/images/ribbon-nostars.png';
import brain from '../../../assets/images/brain.png';
import home from '../../../assets/images/home.png';
import repeat from '../../../assets/images/repeat.png';
import next from '../../../assets/images/next.png';
import clock from '../../../assets/images/alarm-clock.png';
import lightBulb from '../../../assets/images/light-bulb.png';
import styles from '../Play.module.scss';
import { useAppDispatch, useAppSelector } from '../../../services/hooks';
import { PlayState } from '../type';
import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

type ResultProps = {
  setPlayState: React.Dispatch<React.SetStateAction<PlayState>>;
  replay: () => void;
};

export default function Result({ setPlayState, replay }: ResultProps) {
  const [show, setShow] = useState(false);
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const app = useAppSelector(state => state.app);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <CSSTransition
      in={show}
      timeout={300}
      unmountOnExit
      classNames={{
        enter: styles.resultEnter,
        enterActive: styles.resultEnterActive,
      }}
    >
      <div className={styles.resultContainer}>
        <div className={styles.result}>
          <img
            className={styles.ribbonImg}
            src={app.remainTime > 0 ? ribbonStars : ribbonNoStars}
            alt="ribbonStars"
          />
          <div className={styles.ribbonText}>
            <div>{`${t('Level')} ${app.playingLevel}`} </div>
            <div>
              {app.remainTime > 0
                ? t('Complete').toUpperCase()
                : t('Failed').toUpperCase()}
            </div>
          </div>
          <div className={styles.ribbonContent}>
            <div className={styles.ribbonContentRow}>
              <div className={styles.ribbonContentTitle}>{t('Score')}</div>
              <div className={styles.ribbonContentGroup}>
                <img src={brain} alt="brain" />
                <div
                  className={styles.ribbonContentText}
                >{`+${app.gainedScore}`}</div>
              </div>
            </div>

            <div className={styles.ribbonContentRow}>
              <div className={styles.ribbonContentTitle}>{t('Time left')}</div>
              <div className={styles.ribbonContentGroup}>
                <img src={clock} alt="clock" />
                <div className={styles.ribbonContentText}>{app.remainTime}</div>
              </div>
            </div>

            <div className={styles.ribbonContentRow}>
              <div className={styles.ribbonContentTitle}>{t('Reward')}</div>
              <div className={styles.ribbonContentGroup}>
                <img src={lightBulb} alt="lightBulb" />
                <div
                  className={styles.ribbonContentText}
                >{`+${app.gainedHint}`}</div>
              </div>
            </div>

            <div className={styles.ribbonActions}>
              <img src={repeat} alt="repeat" onClick={() => replay()} />
              <img
                src={home}
                alt="home"
                onClick={() => setPlayState('selectLevel')}
              />
              {app.remainTime > 0 && (
                <img
                  src={next}
                  alt="next"
                  onClick={() => setPlayState('ready')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
