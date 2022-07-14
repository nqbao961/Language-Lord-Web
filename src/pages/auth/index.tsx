import { useLocation, useNavigate } from 'react-router-dom';
import { updateUser } from '../../services/@redux/actions';
import * as api from '../../services/api';
import { useAppDispatch } from '../../services/hooks';
import { Location } from '../../services/models';

export default function Auth() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location: Location = useLocation();
  const redirectParams = window.location.search;

  api.googleRedirect(redirectParams).then(res => {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    dispatch(updateUser(res.data.user));
    navigate('/play', { state: { from: location }, replace: true });
  });

  return <></>;
}
