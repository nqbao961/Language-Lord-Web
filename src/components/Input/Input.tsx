import styles from './Input.module.scss';
import { ReactComponent as ErrorIcon } from '../../assets/images/error.svg';
import { ReactElement, useState } from 'react';

type InputProps = {
  id: string;
  value: any;
  label?: string;
  optionalLabel?: string;
  type?: 'textarea' | 'text';
  error?: string;
  placeholder?: string;
  rightIcon?: Element | ReactElement;
  disabled?: boolean;
  maxLength?: number;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export function Input({
  id,
  label,
  optionalLabel,
  value,
  type = 'text',
  error = '',
  placeholder,
  rightIcon,
  disabled = false,
  maxLength,
  handleChange,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      {label && (
        <label htmlFor={id}>
          <div>{label}</div>
          {optionalLabel && (
            <div className={styles.optionalLabel}>{optionalLabel}</div>
          )}
        </label>
      )}
      <div
        className={`${styles.inputWrapper} ${
          type === 'textarea' ? styles.textareaWrapper : ''
        } ${focused ? styles.focused : ''}`}
      >
        {type === 'textarea' ? (
          <textarea
            id={id}
            name={id}
            value={value}
            className={`${styles.textarea} ${
              error !== '' ? styles.error : ''
            } ${rightIcon ? styles.paddingRight : ''}`}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={e => handleChange(e)}
          ></textarea>
        ) : (
          <input
            type={type}
            id={id}
            name={id}
            value={value}
            className={`${styles.input} ${error !== '' ? styles.error : ''} ${
              rightIcon ? styles.paddingRight : ''
            }`}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            onChange={e => handleChange(e)}
          ></input>
        )}
        {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
      </div>
      {(error !== '' || maxLength) && (
        <div className={styles.belowWrapper}>
          {error !== '' ? (
            <div className={styles.errorWrapper}>
              <ErrorIcon />
              <span>{error}</span>
            </div>
          ) : (
            <div></div>
          )}
          {maxLength ? (
            <div className={styles.lengthWrapper}>
              <span>{`${value.toString().split('').length}/${maxLength}`}</span>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
}
