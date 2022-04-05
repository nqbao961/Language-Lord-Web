import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../components';
import styles from './Admin.module.scss';

export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('dashboard', { replace: true });
  }, []);

  return (
    <>
      <Sidebar />
      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </>
  );
}
