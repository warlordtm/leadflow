'use client'

import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className={cn(
        'rounded-md px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200',
        'transition-all duration-150 ease-spring',
        'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-sm'
      )}
    >
      Sign out
    </button>
  )
}
