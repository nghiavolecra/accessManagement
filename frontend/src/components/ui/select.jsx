// src/components/ui/select.jsx
import React from 'react'

export function Select({ children, className = '', ...props }) {
  return (
    <select className={`border px-3 py-2 rounded ${className}`} {...props}>
      {children}
    </select>
  )
}

export function SelectTrigger(props) {
  return <div {...props} />
}

export function SelectValue(props) {
  return <span {...props} />
}

export function SelectContent(props) {
  return <div {...props} />
}

export function SelectItem(props) {
  return <div {...props}>{props.children}</div>
}
