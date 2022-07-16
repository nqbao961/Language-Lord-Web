import styles from '../Play.module.scss';
import setting from '../../../assets/images/setting.png';
import { Modal } from '../../../components';
import { useTranslation } from 'react-i18next';
import { useModalRef, useSounds } from '../../../services/hooks';
import volume from '../../../assets/images/volume.png';
import mute from '../../../assets/images/mute.png';
import sun from '../../../assets/images/sun.png';
import moon from '../../../assets/images/sleeping.png';
import { useEffect, useMemo, useState } from 'react';

type SettingProps = {
  themeSound: HTMLAudioElement;
};

export default function Setting({ themeSound }: SettingProps) {
  const [sound, setSound] = useState(localStorage.getItem('sound') || 'muted');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const { t, i18n } = useTranslation();
  const settingModalRef = useModalRef();
  const buttonSound = useSounds('button');

  const changeSound = (value: string) => {
    value === 'enabled' ? themeSound.play() : themeSound.pause();
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
        onClick={() => {
          buttonSound.play();
          settingModalRef.current?.showModal();
        }}
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
                  onClick={() => {
                    buttonSound.play();
                    changeSound('enabled');
                  }}
                />
                <img
                  className={sound === 'muted' ? styles.active : ''}
                  src={mute}
                  alt="mute"
                  onClick={() => {
                    buttonSound.play();
                    changeSound('muted');
                  }}
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
                  onClick={() => {
                    buttonSound.play();
                    changeTheme('light');
                  }}
                />
                <img
                  className={theme === 'dark' ? styles.active : ''}
                  src={moon}
                  alt="moon"
                  onClick={() => {
                    buttonSound.play();
                    changeTheme('dark');
                  }}
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
