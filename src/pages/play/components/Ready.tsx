import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../Play.module.scss';
import { PlayState } from '../type';

export default function Ready({
  countDown,
  setPlayState,
}: {
  countDown: number;
  setPlayState: React.Dispatch<React.SetStateAction<PlayState>>;
}) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    countDown === -1 && setPlayState('playing');
  }, [countDown]);

  return (
    <div className={styles.ready}>
      <span>{countDown <= 0 ? t('Ready') + '!' : countDown}</span>
    </div>
  );
}
