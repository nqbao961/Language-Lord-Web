import { useEffect } from 'react';

/**
 * Hook that handle clicks outside of the passed ref
 */
export function useClickOutside(
  ref: any,
  handleClickOut: () => void,
  handleClickIn?: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClickOut && handleClickOut();
      } else {
        handleClickIn && handleClickIn();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

/**
 * Hook that handle press Enter
 */
export function usePressEnter(handleFunction: () => void, deps: any[] = []) {
  useEffect(() => {
    function handlePressEnter(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        handleFunction();
      }
    }
    document.addEventListener('keydown', handlePressEnter);
    return () => {
      document.removeEventListener('keydown', handlePressEnter);
    };
  }, deps);
}
