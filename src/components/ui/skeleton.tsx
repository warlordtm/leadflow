import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  variant?: 'default' | 'circular' | 'text'
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, lines, variant = 'default', ...props }, ref) => {
    if (lines && variant === 'text') {
      return (
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-full animate-pulse rounded bg-gray-200 last:w-3/4"
            />
          ))}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-gray-200',
          variant === 'circular' && 'rounded-full aspect-square',
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = 'Skeleton'
