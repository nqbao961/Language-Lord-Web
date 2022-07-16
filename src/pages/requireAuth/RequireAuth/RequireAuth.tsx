import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Location } from '../../../services/models';
import * as api from '../../../services/api';
import { useAppDispatch } from '../../../services/hooks';
import { updateUser } from '../../../services/@redux/actions';

export default function RequireAuth() {
  const navigate = useNavigate();
  const location: Location = useLocation();
  const dispatch = useAppDispatch();

  const token = localStorage.getItem('token');
  const sound = localStorage.getItem('sound'); // enabled/muted
  const theme = localStorage.getItem('theme'); // light/dark

  useEffect(() => {
    !['enabled', 'muted'].includes(sound + '') &&
      localStorage.setItem('sound', 'enabled');
    !['light', 'dark'].includes(theme + '') &&
      localStorage.setItem('theme', 'light');

    if (
      token &&
      token !== 'guest' &&
      location.state?.from?.pathname !== '/google/redirect'
    ) {
      api.getProfile().then(res => {
        localStorage.setItem('user', JSON.stringify(res.data));
        dispatch(updateUser(res.data));
      });
    }

    if (location.state?.from?.pathname === '/google/redirect')
      window.history.replaceState({}, document.title);

    if (token) {
      location.pathname === '/' && navigate('/play', { replace: true });
    } else {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [token]);

  return token ? <Outlet /> : <div></div>;
}
