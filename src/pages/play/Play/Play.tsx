import { Link, useNavigate } from 'react-router-dom';
import styles from './Play.module.scss';

export default function Play() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.container}>
      <button onClick={logout}>Logout</button>
      Play
    </div>
  );
}
