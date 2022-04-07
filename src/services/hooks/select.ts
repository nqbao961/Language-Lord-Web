import { useState } from 'react';

/**
 * Hook that simplify select handling
 */
export function useSelect<T>(initialValue: T) {
  const initValue = initialValue;
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [changed, setChanged] = useState(false);

  const onSelectValue = (selectedValues: T[]) => {
    setError('');
    setValue(selectedValues[0]);
    setChanged(initValue !== selectedValues[0]);
  };

  return {
    states: {
      value,
      setValue,
      error,
      setError,
      onSelectValue,
      changed,
      setChanged,
    },
    bind: {
      value,
      error,
      onSelectValue,
    },
  };
}

/**
 * Hook that simplify multiple select handling
 */
export function useMultipleSelect<T>(initialValue: T[] = []) {
  const initValue = initialValue;
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [changed, setChanged] = useState(false);

  const onSelectValue = (selectedValues: T[]) => {
    setError('');
    setValue(selectedValues);
    setChanged(!compareArray(selectedValues, initValue));
  };

  const compareArray = (arr1: T[], arr2: T[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.reduce(
      (isEqual: boolean, item) => isEqual && arr2.includes(item),
      true
    );
  };

  return {
    states: {
      value,
      setValue,
      error,
      setError,
      onSelectValue,
      changed,
      setChanged,
    },
    bind: {
      value,
      error,
      onSelectValue,
    },
  };
}
