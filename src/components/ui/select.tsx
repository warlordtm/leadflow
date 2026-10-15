import * as React from 'react'
import { cn } from '@/lib/utils'

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-md border bg-white px-3 py-2 pr-8 text-sm',
      'placeholder:text-gray-400 focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = 'Select'

const SelectTrigger = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <Select ref={ref} className={cn('cursor-pointer', className)} {...props}>
    {children}
  </Select>
))
SelectTrigger.displayName = 'SelectTrigger'

const SelectValue = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, ...props }, ref) => <option ref={ref} className={className} {...props} />)
SelectValue.displayName = 'SelectValue'

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('relative', className)} {...props}>
    {children}
  </div>
))
SelectContent.displayName = 'SelectContent'

const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, ...props }, ref) => (
  <option ref={ref} className={cn('cursor-pointer', className)} {...props} />
))
SelectItem.displayName = 'SelectItem'

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
