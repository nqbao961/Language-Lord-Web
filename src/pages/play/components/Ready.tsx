import { useEffect } from 'react';
import styles from '../Play.module.scss';
import { PlayState } from '../type';

export default function Ready({
  countDown,
  setPlayState,
}: {
  countDown: number;
  setPlayState: React.Dispatch<React.SetStateAction<PlayState>>;
}) {
  useEffect(() => {
    countDown === -1 && setPlayState('playing');
  }, [countDown]);

  return (
    <div className={styles.ready}>{countDown === 0 ? 'Ready!' : countDown}</div>
  );
}
