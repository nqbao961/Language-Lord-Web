import { useNavigate } from 'react-router-dom';
import styles from '../Play.module.scss';
import userMale from '../../../assets/images/user-male.png';
import vietnamFlag from '../../../assets/images/vietnam.png';
import usFlag from '../../../assets/images/united-states.png';
import { Modal } from '../../../components';
import {
  useAppDispatch,
  useAppSelector,
  useModalRef,
} from '../../../services/hooks';

export default function Profile() {
  const navigate = useNavigate();
  const userModalRef = useModalRef();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div
        className={styles.profileButton}
        onClick={() => userModalRef.current?.showModal()}
      >
        <img src={userMale} alt="profile-picture" />
        <div className={styles.currentLanguage}>
          <img src={usFlag} alt="flag" />
        </div>
      </div>

      <Modal
        ref={userModalRef}
        body={
          <div className={styles.userBodyModal}>
            <img src={userMale} alt="profile-picture" />
            <div>{user.name}</div>
          </div>
        }
        showClose={false}
      />
    </>
  );
}
