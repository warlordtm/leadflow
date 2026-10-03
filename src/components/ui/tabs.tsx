import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TabsProps {
  tabs: { id: string; label: string }[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, activeTab, onChange, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('border-b border-border-subtle', className)}
      >
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={cn(
                  'border-b-2 px-1 py-3 text-sm font-medium whitespace-nowrap',
                  'transition-all duration-150 ease-spring',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>
    )
  }
)
Tabs.displayName = 'Tabs'
