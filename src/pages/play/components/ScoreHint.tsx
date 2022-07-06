import styles from '../Play.module.scss';
import brain from '../../../assets/images/brain.png';
import lightBulb from '../../../assets/images/light-bulb.png';
import { useAppSelector } from '../../../services/hooks';

export default function ScoreHint() {
  const user = useAppSelector(state => state.user);

  return (
    <div className={styles.score}>
      <div className={styles.wrapper}>
        <img src={brain} alt="brain-icon" />
        {user.score[user.preferedLang]}
      </div>
      <div className={styles.wrapper}>
        <img src={lightBulb} alt="bulb-icon" />
        {user.hint[user.preferedLang]}
      </div>
    </div>
  );
}
