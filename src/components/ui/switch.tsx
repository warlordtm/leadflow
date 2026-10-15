import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onCheckedChange, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e)
      onCheckedChange?.(!checked)
    }

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full',
          'transition-colors focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2',
          'focus-visible:ring-offset-background disabled:cursor-not-allowed',
          'disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-gray-300',
          className
        )}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 transform rounded-full bg-white',
            'transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    )
  }
)
Switch.displayName = 'Switch'

const SwitchRoot = Switch

export { Switch }
