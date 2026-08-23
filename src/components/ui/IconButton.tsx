import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
}

export function IconButton({ label, className = '', children, ...props }: IconButtonProps) {
  return (
    <button className={`btn btn-icon btn-ghost ${className}`} aria-label={label} {...props}>
      {children}
    </button>
  )
}
