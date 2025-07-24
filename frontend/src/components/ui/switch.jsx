// src/components/ui/switch.jsx
import React from 'react'

export function Switch({ checked = false, onChange, className = '' }) {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange && onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`w-10 h-5 block rounded-full transition-colors ${
          checked ? 'bg-emerald-600' : 'bg-gray-300'
        }`}
      ></span>
      <span
        className={`absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      ></span>
    </label>
  )
}
