// frontend/src/components/ui/button.jsx
import React from 'react';
import clsx from 'clsx';

export function Button({ children, variant = 'default', size, asChild, className, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-700',
    outline: 'border border-slate-200 hover:bg-slate-100',
  };
  const classes = clsx(base, variants[variant], size === 'sm' ? 'px-2 py-1 text-sm' : 'px-4 py-2', className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { className: classes, ...props });
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
