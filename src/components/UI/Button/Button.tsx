import styles from './Button.module.css';



type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'large' | 'small' | 'iconOnly' | 'iconOnlySmall';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'large',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
}