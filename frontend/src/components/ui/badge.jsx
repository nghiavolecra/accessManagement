// src/components/ui/badge.jsx
import React from 'react'

export function Badge({ children, variant = 'default', className = '', ...props }) {
  const styles = {
    default: 'bg-gray-200 text-gray-800',
    secondary: 'bg-slate-100 text-slate-900',
    outline: 'border border-gray-300 text-gray-700',
  }
  return (
    <span className={`${styles[variant] || styles.default} px-2 py-1 rounded text-xs font-medium ${className}`} {...props}>
      {children}
    </span>
  )
}
