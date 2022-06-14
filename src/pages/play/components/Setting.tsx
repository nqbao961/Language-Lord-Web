import styles from '../Play.module.scss';
import setting from '../../../assets/images/setting.png';

export default function Setting() {
  return (
    <div className={styles.setting}>
      <img src={setting} alt="setting-icon" />
    </div>
  );
}
