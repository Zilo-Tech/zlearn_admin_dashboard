import React from 'react';

type BadgeVariant = 'draft' | 'published' | 'archived' | 'suspended' | 'active' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-emerald-50 text-emerald-700',
  archived: 'bg-amber-50 text-amber-700',
  suspended: 'bg-red-50 text-red-700',
  active: 'bg-emerald-50 text-emerald-700',
  default: 'bg-surface-muted text-gray-600',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
