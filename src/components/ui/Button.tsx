import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  children: ReactNode
}

export function Button({ variant = 'ghost', size = 'md', className = '', children, ...props }: ButtonProps) {
  const variantClass = variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-danger' : 'btn-ghost'
  const sizeClass = size === 'sm' ? 'btn-sm' : ''
  return (
    <button className={`btn ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
