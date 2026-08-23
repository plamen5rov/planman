import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export function Select({ label, className = '', children, ...props }: SelectProps) {
  return (
    <>
      {label && <label className="sr-only">{label}</label>}
      <select className={`select ${className}`} {...props}>
        {children}
      </select>
    </>
  )
}
