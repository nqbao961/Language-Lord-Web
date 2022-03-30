import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../components';

export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('dashboard', { replace: true });
  }, []);

  return (
    <div>
      <Sidebar />
      Admin
      <Outlet />
    </div>
  );
}
