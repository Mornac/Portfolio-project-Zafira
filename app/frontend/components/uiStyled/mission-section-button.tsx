'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface MissionSectionButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export default function MissionSectionButton({
  children,
  href,
  onClick,
  variant = 'primary',
}: MissionSectionButtonProps) {
  const baseClasses =
    'rounded-full px-8 py-3 text-white transition-colors font-medium';
  const variantClasses =
    variant === 'primary'
      ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]'
      : 'bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]';

  const button = (
    <Button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
      size="lg"
    >
      {children}
    </Button>
  );

  if (href) {
    return <a href={href}>{button}</a>;
  }

  return button;
}
