'use client';

import React from 'react';
import Link from 'next/link';
import css from './Button.module.css';

interface BaseProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  ariaLabel?: string;
}

interface LinkProps extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  type?: never; 
}

interface ButtonProps extends BaseProps {
  href?: never; 
  target?: never;
  rel?: never;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

type ButtonComponentProps = LinkProps | ButtonProps;

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  disabled = false,
  ariaLabel,
  href,
  target,
  rel,
  type = 'button',
  onClick,
}: ButtonComponentProps) => {
  
  const rootClassName = `${css.btn} ${css[variant]} ${disabled ? css.disabled : ''} ${className}`.trim();

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={rootClassName}
        target={target}
        rel={rel}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={rootClassName}
      disabled={disabled}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
