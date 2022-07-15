import { useNavigate } from 'react-router-dom';
import styles from '../Play.module.scss';
import userMale from '../../../assets/images/user-male.png';
import vietnamFlag from '../../../assets/images/vietnam.png';
import usFlag from '../../../assets/images/united-states.png';
import { Button, Modal } from '../../../components';
import {
  useAppDispatch,
  useAppSelector,
  useModalRef,
} from '../../../services/hooks';
import { useTranslation } from 'react-i18next';
import { User } from '../../../services/models';
import { updateUserLang } from '../../../services/@redux/actions';

export default function Profile() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const userModalRef = useModalRef();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
    history.go(0);
  };

  const changeLang = (lang: User['preferedLang']) => {
    dispatch(updateUserLang(lang));
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <div
        className={styles.profileButton}
        onClick={() => userModalRef.current?.showModal()}
      >
        <img
          src={user.avatar || userMale}
          alt="profile-picture"
          referrerPolicy="no-referrer"
        />
        <div className={styles.currentLanguage}>
          <img
            src={user.preferedLang === 'en' ? usFlag : vietnamFlag}
            alt="flag"
          />
        </div>
      </div>

      <Modal
        ref={userModalRef}
        body={
          <div className={styles.userBodyModal}>
            <h2>{t('Profile')}</h2>

            <div className={styles.userBodyRow}>
              <div className={styles.profileButton}>
                <img
                  src={user.avatar || userMale}
                  alt="profile-picture"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>{user.name}</div>
            </div>

            <div className={styles.userBodyRow}>
              <div>{t('Language')}</div>
              <div className={styles.language}>
                <img
                  className={user.preferedLang === 'en' ? styles.active : ''}
                  src={usFlag}
                  alt="us-flag"
                  onClick={() => changeLang('en')}
                />
                <img
                  className={user.preferedLang === 'vi' ? styles.active : ''}
                  src={vietnamFlag}
                  alt="vietnam-flag"
                  onClick={() => changeLang('vi')}
                />
              </div>
            </div>

            <Button
              className={styles.bigFont}
              label={t('Logout')}
              type="danger"
              handleClick={() => logout()}
            />
          </div>
        }
        showClose={false}
      />
    </>
  );
}
