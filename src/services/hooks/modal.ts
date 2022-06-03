import { useRef } from 'react';
import { ModalImperativeType } from '../../components/Modal/Modal';

export const useModalRef = () => useRef<ModalImperativeType>(null);

export type TModalRef = React.MutableRefObject<ModalImperativeType>;
