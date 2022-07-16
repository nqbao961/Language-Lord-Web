import styles from '../Play.module.scss';
import trophy from '../../../assets/images/trophy.png';
import { Modal } from '../../../components';
import { useTranslation } from 'react-i18next';
import {
  useAppDispatch,
  useAppSelector,
  useModalRef,
  useSounds,
} from '../../../services/hooks';
import { handleCallApi } from '../../../services/@redux/utils';
import * as api from '../../../services/api';
import { useState } from 'react';

export default function Rank() {
  const [rankList, setRankList] = useState<any>(undefined);

  const { t, i18n } = useTranslation();
  const rankModalRef = useModalRef();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const buttonSound = useSounds('button');

  const handleGetRank = () => {
    handleCallApi(dispatch, async () => {
      const { data } = await api.getRank();
      const list = data[user.preferedLang].map((u, i) => (
        <div
          className={styles.rankItem}
          key={i}
          style={
            u._id === user._id
              ? {
                  backgroundColor: 'var(--tertiary-container)',
                }
              : {}
          }
        >
          <div className={styles.rankItemInfo}>
            <div>{i + 1 + '. '}</div>
            <img src={u.avatar} alt="avatar" referrerPolicy="no-referrer" />
            <div>{u.name}</div>
          </div>
          <div>{u.score[user.preferedLang]}</div>
        </div>
      ));
      setRankList(list);

      rankModalRef.current?.showModal();
    });
  };

  return (
    <>
      <div
        className={styles.rank}
        onClick={() => {
          buttonSound.play();
          handleGetRank();
        }}
      >
        <img src={trophy} alt="trophy-icon" />
      </div>

      <Modal
        ref={rankModalRef}
        header={<div className={styles.rankHeaderModal}>{t('Rank')}</div>}
        body={<div className={styles.rankBodyModal}>{rankList}</div>}
        showCloseButton={false}
        bodyMaxHeight="60vh"
      />
    </>
  );
}
