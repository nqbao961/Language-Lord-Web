import styles from '../Play.module.scss';
import setting from '../../../assets/images/setting.png';
import { Modal } from '../../../components';
import { useTranslation } from 'react-i18next';
import { useModalRef } from '../../../services/hooks';
import volume from '../../../assets/images/volume.png';
import mute from '../../../assets/images/mute.png';
import sun from '../../../assets/images/sun.png';
import moon from '../../../assets/images/sleeping.png';
import { useEffect, useState } from 'react';

export default function Setting() {
  const [sound, setSound] = useState(localStorage.getItem('sound') || 'enable');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const { t, i18n } = useTranslation();
  const settingModalRef = useModalRef();

  const changeSound = (value: string) => {
    setSound(value);
    localStorage.setItem('sound', value);
  };
  const changeTheme = (value: string) => {
    setTheme(value);
    localStorage.setItem('theme', value);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <div
        className={styles.setting}
        onClick={() => settingModalRef.current?.showModal()}
      >
        <img src={setting} alt="setting-icon" />
      </div>

      <Modal
        ref={settingModalRef}
        body={
          <div className={styles.settingBodyModal}>
            <h2>{t('Setting')}</h2>

            <div className={styles.settingBodyRow}>
              <div>{t('Sound')}</div>
              <div className={styles.settingBodyAction}>
                <img
                  className={sound === 'enabled' ? styles.active : ''}
                  src={volume}
                  alt="volume"
                  onClick={() => changeSound('enabled')}
                />
                <img
                  className={sound === 'muted' ? styles.active : ''}
                  src={mute}
                  alt="mute"
                  onClick={() => changeSound('muted')}
                />
              </div>
            </div>

            <div className={styles.settingBodyRow}>
              <div>{t('Theme')}</div>
              <div className={styles.settingBodyAction}>
                <img
                  className={theme === 'light' ? styles.active : ''}
                  src={sun}
                  alt="sun"
                  onClick={() => changeTheme('light')}
                />
                <img
                  className={theme === 'dark' ? styles.active : ''}
                  src={moon}
                  alt="moon"
                  onClick={() => changeTheme('dark')}
                />
              </div>
            </div>
          </div>
        }
        showClose={false}
      />
    </>
  );
}
