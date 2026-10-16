import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked: controlledChecked, defaultChecked = false, onCheckedChange, onClick, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked)
    const isControlled = controlledChecked !== undefined
    const currentChecked = isControlled ? controlledChecked : isChecked

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e)
      const nextChecked = !currentChecked
      if (!isControlled) {
        setIsChecked(nextChecked)
      }
      onCheckedChange?.(nextChecked)
    }

    return (
      <button
        type="button"
        role="switch"
        aria-checked={currentChecked}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full',
          'transition-colors focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2',
          'focus-visible:ring-offset-background disabled:cursor-not-allowed',
          'disabled:opacity-50',
          currentChecked ? 'bg-primary' : 'bg-gray-300',
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
            currentChecked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    )
  }
)
Switch.displayName = 'Switch'

const SwitchRoot = Switch

export { Switch }
