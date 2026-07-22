'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface CosmicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

export function CosmicButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  glow = true,
  icon,
  fullWidth = false,
  ...props
}: CosmicButtonProps) {
  const sizeMap = {
    sm: 'px-5 py-2.5 text-sm gap-2',
    md: 'px-7 py-3.5 text-base gap-2.5',
    lg: 'px-10 py-4.5 text-lg gap-3',
  }

  const variantMap = {
    primary: 'bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/40',
    outline: 'border border-white/10 hover:bg-white/5 text-foreground hover:border-purple-500/30',
    ghost: 'hover:bg-white/5 text-foreground',
  }

  return (
    <button
      className={cn(
        'relative rounded-full font-semibold transition-all duration-300 overflow-hidden',
        'flex items-center justify-center',
        sizeMap[size],
        variantMap[variant],
        glow && 'shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  )
}