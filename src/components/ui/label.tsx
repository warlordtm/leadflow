import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none text-gray-700',
        'after:text-red-500 after:content-[\"\\0020\"] after:font-normal',
        className
      )}
      {...props}
    />
  )
)
Label.displayName = 'Label'

export { Label }
