import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-white border border-border-subtle',
          variant === 'elevated'
            ? 'shadow-lg'
            : 'shadow-sm transition-shadow duration-250 ease-emphasized',
          'hover:shadow-md',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('border-b border-border-subtle px-6 py-4', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('border-t border-border-subtle px-6 py-4', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'
