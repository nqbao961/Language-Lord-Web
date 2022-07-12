import { useNavigate } from 'react-router-dom';
import * as api from '../../services/api';

export default function Auth() {
  const navigate = useNavigate();
  const redirectParams = window.location.search;
  api.googleRedirect(redirectParams).then(res => {
    console.log(res);
    localStorage.setItem('token', res.data.user.accessToken);
    navigate('/play', { replace: true });
  });

  return <></>;
}
