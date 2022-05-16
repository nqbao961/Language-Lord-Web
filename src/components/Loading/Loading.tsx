import styles from './Loading.module.scss';
import catLoading from '../../assets/images/cat-loading.svg';
import { useAppSelector } from '../../services/hooks';

export function Loading({ loading }: { loading?: boolean }) {
  const app = loading ? { loading: true } : useAppSelector(state => state.app);

  return app.loading ? (
    <div className={styles.container}>
      <img src={catLoading} alt="loading" />
    </div>
  ) : (
    <></>
  );
}
