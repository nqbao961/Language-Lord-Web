import styles from './Modal.module.scss';
import { useEffect, useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { hideModal } from '../../services/@redux/actions';
import { createPortal } from 'react-dom';
import { Button } from '../Button';

export function Modal() {
  const modalRootEl = document.querySelector<HTMLElement>('#modal-root');
  const appModal = useAppSelector(state => state.app.modal);
  const dispatch = useAppDispatch();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePressEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && appModal.allowEsc && handleHideModal();
    };

    if (appModal.show) {
      wrapperRef!?.current!?.focus();
      document.addEventListener('keydown', handlePressEsc);

      if (document.body.scrollHeight > window.innerHeight) {
        document.body.classList.add('modal-show');
      }
    } else {
      document.body.classList.remove('modal-show');
    }

    return () => {
      document.removeEventListener('keydown', handlePressEsc);
    };
  }, [appModal.show]);

  function handleHideModal() {
    dispatch(hideModal());
  }

  const modalEl = (
    <div className={styles.container}>
      <div
        ref={wrapperRef}
        className={styles.wrapper}
        style={{ width: appModal.width || undefined }}
        tabIndex={0}
      >
        {appModal.showClose && (
          <i
            className={`fa-solid fa-xmark-large ${styles.closeIcon}`}
            onClick={() => handleHideModal()}
          ></i>
        )}
        {appModal.header && (
          <h3 className={styles.header}>{appModal.header}</h3>
        )}
        {appModal.body && (
          <div className={styles.body}>
            {appModal.bodyMaxHeight ? (
              <SimpleBar
                style={{ maxHeight: appModal.bodyMaxHeight, width: 'auto' }}
              >
                {appModal.body}
              </SimpleBar>
            ) : (
              appModal.body
            )}
          </div>
        )}
        {appModal.showCloseButton && (
          <div className={styles.footer}>
            <Button label="Okay" handleClick={() => handleHideModal()} />
          </div>
        )}
        {appModal.footer && (
          <div className={styles.footer}>{appModal.footer}</div>
        )}
      </div>
    </div>
  );

  return appModal.show ? createPortal(modalEl, modalRootEl!) : null;
}
