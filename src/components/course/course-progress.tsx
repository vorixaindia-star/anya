'use client'

import { Course } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { BookOpen, Users, Star } from 'lucide-react'

interface CourseCardProps {
  course: Course
  variant?: 'public' | 'dashboard'
}

export function CourseCard({ course, variant = 'public' }: CourseCardProps) {
  const isDashboard = variant === 'dashboard'

  return (
    <GlassCard hover glow padding="sm">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-purple-400/50" />
          </div>
        )}
        {course.level && (
          <span className="absolute top-2 right-2 px-3 py-1 text-xs font-medium rounded-full glass border border-white/10">
            {course.level}
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold line-clamp-1">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{course.subtitle || course.description}</p>
        
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.total_students || 0}</span>
          </div>
          {course.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <span className="text-xl font-bold gradient-text">₹{course.price}</span>
          {isDashboard ? (
            <CosmicButton size="sm" variant="outline">
              <a href={`/instructor/courses/${course.id}`}>Manage</a>
            </CosmicButton>
          ) : (
            <CosmicButton size="sm" glow>
              <a href={`/courses/${course.id}`}>Enroll Now</a>
            </CosmicButton>
          )}
        </div>
      </div>
    </GlassCard>
  )
}