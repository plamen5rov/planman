import { Check } from '@phosphor-icons/react'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <button
      type="button"
      className="checkbox"
      data-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      {checked && <Check weight="bold" />}
    </button>
  )
}
