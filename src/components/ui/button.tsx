import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm hover:shadow-md hover:-translate-y-px active:translate-y-0 transition-all duration-150 ease-spring',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
  outline:
    'border border-border bg-background text-foreground hover:bg-accent focus:ring-primary',
  ghost:
    'text-muted-foreground hover:bg-accent hover:text-foreground focus:ring-primary',
  destructive:
    'bg-error text-white hover:bg-error/90 focus:ring-error',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium outline-none',
          'focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none',
          variantClasses[variant],
          sizeClasses[size],
          'transition-all duration-150 ease-spring',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
