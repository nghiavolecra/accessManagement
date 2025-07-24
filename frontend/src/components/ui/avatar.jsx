// src/components/ui/avatar.jsx
import React from 'react'

export function Avatar({ children, className = '', ...props }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-gray-100 overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  )
}

export function AvatarImage({ src, alt, ...props }) {
  return <img src={src} alt={alt} className="w-8 h-8 object-cover" {...props} />
}

export function AvatarFallback({ children, className = '', ...props }) {
  return (
    <span className={`w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 ${className}`} {...props}>
      {children}
    </span>
  )
}
