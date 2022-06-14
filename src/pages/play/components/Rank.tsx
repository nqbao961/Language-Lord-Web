import styles from '../Play.module.scss';
import trophy from '../../../assets/images/trophy.png';

export default function Rank() {
  return (
    <div className={styles.rank}>
      <img src={trophy} alt="trophy-icon" />
    </div>
  );
}
