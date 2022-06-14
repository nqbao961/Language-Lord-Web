import { useNavigate } from 'react-router-dom';
import styles from '../Play.module.scss';
import userMale from '../../../assets/images/user-male.png';
import vietnamFlag from '../../../assets/images/vietnam.png';
import usFlag from '../../../assets/images/united-states.png';

export default function Profile() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };
  return (
    <div className={styles.profileButton}>
      <img src={userMale} alt="profile-picture" />
      <div className={styles.currentLanguage}>
        <img src={usFlag} alt="flag" />
      </div>
    </div>
  );
}
