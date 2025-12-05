'use client';

import React from 'react';
import { Button } from './button'; // On utilise le Button “solide” précédent

interface BlogSectionButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'jaune' | 'secondary' | 'blog'; // Correspond aux variantes disponibles
  size?: 'default' | 'sm' | 'lg'; // Correspond aux tailles disponibles
}

export default function BlogSectionButton({
  children,
  href,
  onClick,
  variant = 'default',
  size = 'default',
}: BlogSectionButtonProps) {
  return (
    <Button href={href} onClick={onClick} variant={variant} size={size}>
      {children}
    </Button>
  );
}
