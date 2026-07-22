'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Course, Enrollment } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { BookOpen, Users, Star, Clock, CheckCircle, TrendingUp } from 'lucide-react'

export default function StudentCoursesPage() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:course_id (*)
        `)
        .eq('student_id', user.id)
        .order('enrolled_at', { ascending: false })

      if (!error && data) setEnrollments(data)
      setLoading(false)
    }

    fetchEnrollments()
  }, [user])

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Please login to view your courses</h2>
        <a href="/login">
          <CosmicButton glow className="mt-4">Login</CosmicButton>
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} padding="sm">
              <div className="aspect-video rounded-xl bg-muted/50 shimmer" />
              <div className="mt-4 h-6 w-3/4 bg-muted/50 rounded shimmer" />
              <div className="mt-4 h-10 w-full bg-muted/50 rounded shimmer" />
            </GlassCard>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No courses yet</h3>
          <p className="text-muted-foreground">Explore our catalog and start learning!</p>
          <a href="/courses">
            <CosmicButton glow className="mt-4">Browse Courses</CosmicButton>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <GlassCard key={enrollment.id} hover padding="sm">
              <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative">
                {enrollment.course.thumbnail_url ? (
                  <img src={enrollment.course.thumbnail_url} alt={enrollment.course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-purple-400/50" />
                  </div>
                )}
                <span className="absolute top-2 right-2 px-3 py-1 text-xs font-medium rounded-full glass border border-white/10">
                  {enrollment.progress}%
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold line-clamp-1">{enrollment.course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {enrollment.course.subtitle || enrollment.course.description}
                </p>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>In progress</span>
                  </div>
                  {enrollment.completed && (
                    <div className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{enrollment.progress}%</span>
                  </div>
                  <a href={`/student/courses/${enrollment.course_id}`}>
                    <CosmicButton size="sm" glow fullWidth className="mt-3">
                      Continue Learning
                    </CosmicButton>
                  </a>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}