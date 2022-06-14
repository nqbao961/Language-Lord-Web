import styles from '../Play.module.scss';
import brain from '../../../assets/images/brain.png';
import lightBulb from '../../../assets/images/light-bulb.png';

export default function ScoreHint() {
  return (
    <div className={styles.score}>
      <div className={styles.wrapper}>
        <img src={brain} alt="brain-icon" />
        {20}
      </div>
      <div className={styles.wrapper}>
        <img src={lightBulb} alt="bulb-icon" />
        {20}
      </div>
    </div>
  );
}
