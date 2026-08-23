import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function TextField({ label, className = '', ...props }: TextFieldProps) {
  return (
    <>
      {label && <label className="sr-only">{label}</label>}
      <input className={`input ${className}`} {...props} />
    </>
  )
}
