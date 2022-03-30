import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Location } from '../../../services/models';

export default function Login() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location: Location = useLocation();

  const from = location.state?.from?.pathname || '/play';

  useEffect(() => {
    token && navigate('/', { replace: true });
  }, [token]);

  const login = () => {
    localStorage.setItem('token', '123');
    navigate(from, { replace: true });
  };
  return (
    <div>
      <button onClick={login}>Login</button>
    </div>
  );
}
