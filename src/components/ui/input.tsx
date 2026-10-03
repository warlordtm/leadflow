import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'w-full rounded-md border bg-white px-3.5 py-2 text-sm text-gray-900 outline-none',
            'transition-all duration-150 ease-spring',
            error
              ? 'border-error focus:border-error focus:ring-error/20'
              : 'border-border focus:border-primary focus:ring-primary/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-error">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'w-full rounded-md border bg-white px-3.5 py-2 text-sm text-gray-900 outline-none',
            'resize-y transition-all duration-150 ease-spring',
            error
              ? 'border-error focus:border-error focus:ring-error/20'
              : 'border-border focus:border-primary focus:ring-primary/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-error">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
