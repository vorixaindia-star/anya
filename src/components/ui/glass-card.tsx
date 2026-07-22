import { cn } from '@/lib/utils'
import { ReactNode, HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
  delay?: number
}

const paddingMap = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  padding = 'md',
  animate = false,
  delay = 0,
  onClick,
  ...props
}: GlassCardProps) {
  const baseClasses = cn(
    'glass-card',
    'rounded-2xl transition-all duration-500 ease-out',
    'border border-white/10',
    'shadow-lg shadow-black/5',
    hover && 'hover:scale-[1.02] hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/20',
    glow && 'border-purple-500/30 shadow-purple-500/20',
    paddingMap[padding],
    className
  )

  if (animate) {
    return (
      <div
        className={baseClasses}
        style={{
          animation: 'fadeInUp 0.7s ease-out forwards',
          animationDelay: `${delay}s`,
        }}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={baseClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}