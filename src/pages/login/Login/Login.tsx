import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components';
import { Location, User } from '../../../services/models';
import styles from './Login.module.scss';
import logo from '../../../assets/images/logo-lang.png';
import google from '../../../assets/images/google.png';
import i18next from 'i18next';
import { useAppDispatch } from '../../../services/hooks';
import { updateUserLang } from '../../../services/@redux/actions';
import { baseURL } from '../../../services/api/config';

export default function Login() {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location: Location = useLocation();
  const dispatch = useAppDispatch();

  const from = location.state?.from?.pathname || '/play';

  useEffect(() => {
    token && navigate('/', { replace: true });
  }, [token]);

  const login = () => {
    localStorage.setItem('token', 'guest');
    localStorage.setItem('i18nextLng', i18next.languages[0]);
    dispatch(updateUserLang(i18next.languages[0] as User['preferedLang']));
    localStorage.setItem('theme', '');
    navigate(from, { replace: true });
  };

  const handleGoogleLogin = () => {
    window.location.href = baseURL + '/google';
  };

  return (
    <div className={styles.container}>
      <img className={styles.logo} src={logo} alt="logo" />
      <div className={styles.buttonGroup}>
        <Button label={t('Play as guest')} handleClick={login} />
        <Button
          label={
            <div className={styles.buttonWithIcon}>
              <img src={google} alt="google-icon" />
              <div>{t('Login with Google')}</div>
            </div>
          }
          handleClick={() => {
            handleGoogleLogin();
          }}
        />
      </div>
    </div>
  );
}
