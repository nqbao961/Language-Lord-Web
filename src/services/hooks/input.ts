import { useState } from 'react';

/**
 * Hook that simplify input handling
 */
export function useInput(
  initialValue: string = '',
  handleChangePlus?: (name: string, value: string) => void,
  willSetError: boolean = true
) {
  const initValue = initialValue || '';
  const [value, setValue] = useState(initialValue || '');
  const [error, setError] = useState<string | undefined>('');
  const [changed, setChanged] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    willSetError && setError('');
    setValue(event.target.value);
    setChanged(initValue !== event.target.value);
    handleChangePlus && handleChangePlus(event.target.name, event.target.value);
  };

  return {
    states: {
      value,
      setValue,
      error,
      setError,
      handleChange,
      changed,
    },
    bind: {
      value,
      error,
      handleChange,
    },
  };
}
