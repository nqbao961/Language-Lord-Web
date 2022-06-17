import { NavLink, useNavigate } from 'react-router-dom';
import { adminRoutes } from '../../services/router/routes';
import styles from './Sidebar.module.scss';
import vietnamFlag from '../../assets/images/vietnam.png';
import usFlag from '../../assets/images/united-states.png';
import { useEffect, useState } from 'react';
import { User } from '../../services/models';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { updateUserLang } from '../../services/@redux/actions';

export function Sidebar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || '');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    user.preferedLang && i18n.changeLanguage(user.preferedLang);
  }, [user.preferedLang]);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const icon = (e.currentTarget as HTMLAnchorElement).querySelector(
      '.fa-solid'
    );
    icon!.classList.add('fa-beat-fade');
    setTimeout(() => {
      icon!.classList.remove('fa-beat-fade');
    }, 500);
  };

  const changeLang = (lang: User['preferedLang']) => {
    dispatch(updateUserLang(lang));
  };

  const changeTheme = (theme: string) => {
    localStorage.setItem('theme', theme);
    setTheme(theme);
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.desktopIcon}>icon</div>
      <ul className={styles.tabList}>
        {adminRoutes.map((route, i) => (
          <li key={i} className={styles.tabItem}>
            <NavLink
              to={route.path!}
              className={({ isActive }) =>
                `${styles.tabLink} ${isActive ? styles.active : ''}`
              }
              onMouseDown={e => handleMouseDown(e)}
            >
              <i className={`fa-solid ${route.faIcon}`}></i>
              <span>{t(route.title!)}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className={styles.actionBar}>
        <div className={styles.mobileIcon}>icon</div>
        <div className={styles.actionContainer}>
          <div className={styles.language}>
            <img
              className={user.preferedLang === 'vi' ? styles.active : ''}
              src={vietnamFlag}
              alt="vietnam-flag"
              onClick={() => changeLang('vi')}
            />
            <img
              className={user.preferedLang === 'en' ? styles.active : ''}
              src={usFlag}
              alt="us-flag"
              onClick={() => changeLang('en')}
            />
          </div>
          <div
            className={styles.theme}
            onClick={() => changeTheme(theme === 'dark' ? '' : 'dark')}
          >
            <div className={styles.themeIcon}>
              <i
                className={`fa-solid ${
                  theme === 'dark'
                    ? 'fa-brightness-low'
                    : styles.active + ' fa-brightness'
                }`}
              ></i>
            </div>
            <div className={styles.themeIcon}>
              <i
                className={`fa-solid ${
                  theme === 'dark'
                    ? styles.active + ' fa-moon-stars'
                    : 'fa-moon'
                }`}
              ></i>
            </div>
          </div>
          <div className={styles.logout} onClick={logout}>
            <i className="fa-solid fa-right-from-bracket"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
