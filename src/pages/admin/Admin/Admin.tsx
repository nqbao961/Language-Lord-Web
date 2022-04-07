import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../components';
import { Location } from '../../../services/models';
import styles from './Admin.module.scss';

export default function Admin() {
  const navigate = useNavigate();
  const location: Location = useLocation();

  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/')
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
