'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'jaune'
  | 'blog'
  | 'connect'
  | 'rose'
  | 'bleu'
  | 'blanc'
  | 'fake'
  | 'delete'
  | 'light'
  | 'heroSection'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link';

type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string; // si tu veux un lien
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean; // optionnel pour Slot si tu veux l'utiliser
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  href,
  ...props
}) => {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
    // Variants
    variant === 'default' && 'bg-white text-primary-foreground hover:bg-bg-alt',
    variant === 'jaune' && 'bg-accent text-text hover:bg-accent-hover hover:text-white',
    variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    variant === 'blog' && 'bg-primary text-white hover:bg-primary-hover',
    variant === 'connect' && 'bg-secondary text-white hover:bg-secondary-hover',
    variant === 'rose' && 'bg-primary text-text hover:bg-primary-hover hover:text-white',
    variant === 'bleu' && 'bg-secondary text-text hover:bg-secondary-hover hover:text-white',
    variant === 'blanc' && 'bg-bg text-text text-blue-500 hover:bg-blue-50',
    variant === 'fake' && 'bg-white text-primary-foreground',
    variant === 'delete' &&
      'border border-red-500 bg-white text-red-500 hover:bg-red-500 hover:text-bg hover:border-gray-100',
    variant === 'light' &&
      'border bg-bg text-primary border-black hover:bg-gray-100 hover:border-primary',
    variant === 'heroSection' && 'bg-secondary text-white hover:bg-secondary-hover',
    variant === 'destructive' && 'bg-destructive text-white hover:bg-destructive/90',
    variant === 'outline' && 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
    variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
    variant === 'link' && 'text-primary underline-offset-4 hover:underline',
    // Sizes
    size === 'default' && 'px-8 py-3',
    size === 'sm' && 'h-8 px-3 gap-1.5',
    size === 'lg' && 'h-10 px-6',
    size === 'icon' && 'h-9 w-9',
    size === 'icon-sm' && 'h-8 w-8',
    size === 'icon-lg' && 'h-10 w-10'
  );

  if (href) {
    // On ne transmet que ce qui est compatible <a>
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
