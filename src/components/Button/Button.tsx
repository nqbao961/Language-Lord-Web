import styles from './Button.module.scss';

type ButtonProps = {
  label: string | JSX.Element;
  className?: string;
  kind?: 'button' | 'fab';
  type?: 'primary' | 'danger' | 'outline' | 'transparent' | 'choice';
  disabled?: boolean;
  handleClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export function Button({
  label,
  className,
  kind = 'button',
  type,
  disabled = false,
  handleClick = () => {},
}: ButtonProps) {
  return (
    <button
      className={`${styles.container} ${className || ''} ${
        styles[type || 'primary']
      } ${kind === 'fab' ? styles.fab : ''} ${disabled ? styles.disabled : ''}`}
      onClick={e => handleClick(e)}
    >
      {label}
    </button>
  );
}
