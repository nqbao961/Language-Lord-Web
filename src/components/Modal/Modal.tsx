import styles from './Modal.module.scss';
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import SimpleBar from 'simplebar-react';
import { createPortal } from 'react-dom';
import { Button } from '../Button';

export type ModalImperativeType = {
  showModal: () => void;
  hideModal: () => void;
} | null;

type ModalProps = {
  header?: any;
  body?: any;
  footer?: any;
  width?: number | string;
  bodyMaxHeight?: number;
  showClose?: boolean;
  showCloseButton?: boolean;
  allowEsc?: boolean;
  keepAlive?: boolean;
  handleOkay?: () => void;
};

function Modal(
  {
    header,
    body,
    footer,
    width,
    bodyMaxHeight,
    showClose = true,
    showCloseButton = true,
    allowEsc = true,
    keepAlive = false,
    handleOkay,
  }: ModalProps,
  ref: Ref<ModalImperativeType>
): any {
  const [show, setShow] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    showModal() {
      setShow(true);
    },
    hideModal() {
      setShow(false);
    },
  }));

  const modalRootEl = document.querySelector<HTMLElement>('#modal-root');

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  function handleHideModal() {
    setShow(false);
  }

  const modalEl = (
    <div ref={containerRef} className={styles.container}>
      <div
        ref={wrapperRef}
        className={styles.wrapper}
        style={{ width: width || undefined }}
        tabIndex={0}
      >
        {showClose && (
          <i
            className={`fa-solid fa-xmark-large ${styles.closeIcon}`}
            onClick={() => handleHideModal()}
          ></i>
        )}
        {header && <h3 className={styles.header}>{header}</h3>}
        {body && (
          <div className={styles.body}>
            {bodyMaxHeight ? (
              <SimpleBar style={{ maxHeight: bodyMaxHeight, width: 'auto' }}>
                {body}
              </SimpleBar>
            ) : (
              body
            )}
          </div>
        )}
        {showCloseButton && (
          <div className={styles.footer}>
            <Button
              label="Okay"
              handleClick={() => {
                handleOkay && handleOkay();
                handleHideModal();
              }}
            />
          </div>
        )}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );

  useEffect(() => {
    const handlePressEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && allowEsc && handleHideModal();
    };

    if (show) {
      wrapperRef!?.current!?.focus();
      document.addEventListener('keydown', handlePressEsc);

      if (document.body.scrollHeight > window.innerHeight) {
        document.body.classList.add('modal-show');
      }

      if (keepAlive) {
        containerRef.current!.style.display = 'flex';
      }
    } else {
      document.body.classList.remove('modal-show');
      if (keepAlive) {
        containerRef.current!.style.display = 'none';
      }
    }

    return () => {
      document.removeEventListener('keydown', handlePressEsc);
    };
  }, [show]);

  return (
    <>
      {keepAlive
        ? createPortal(modalEl, modalRootEl!)
        : show
        ? createPortal(modalEl, modalRootEl!)
        : null}
    </>
  );
}

export default forwardRef(Modal);
