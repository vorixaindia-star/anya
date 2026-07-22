'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { PlusCircle, BookOpen, Users, Star, Edit, Trash2 } from 'lucide-react'

interface Course {
  id: string
  title: string
  subtitle?: string
  price: number
  level: string
  category: string
  status: string
  total_students?: number
  rating?: number
}

export default function InstructorCoursesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Failed to load courses')
      } else {
        setCourses(data || [])
      }
      setLoading(false)
    }

    fetchCourses()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    const { error } = await supabase.from('courses').delete().eq('id', id)

    if (error) {
      toast.error('Failed to delete course')
    } else {
      toast.success('Course deleted')
      setCourses(courses.filter((c) => c.id !== id))
    }
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Please login to view your courses</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">Manage your courses</p>
        </div>
        <CosmicButton glow onClick={() => router.push('/instructor/courses/new')}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Course
        </CosmicButton>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} padding="sm" className="h-48 shimmer">
              <div className="h-full w-full shimmer" />
            </GlassCard>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <GlassCard padding="lg" className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No courses yet</h3>
          <p className="text-sm text-muted-foreground">Create your first course and start teaching</p>
          <CosmicButton className="mt-4" onClick={() => router.push('/instructor/courses/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Course
          </CosmicButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <GlassCard key={course.id} hover padding="md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                  {course.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-1">{course.subtitle}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full glass border border-white/10 text-xs">
                      {course.level}
                    </span>
                    <span className="px-2 py-0.5 rounded-full glass border border-white/10 text-xs">
                      {course.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full glass border text-xs ${
                        course.status === 'published'
                          ? 'border-green-500/30 text-green-400'
                          : 'border-yellow-500/30 text-yellow-400'
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <CosmicButton
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/instructor/courses/${course.id}/edit`)}
                  >
                    <Edit className="h-3 w-3" />
                  </CosmicButton>
                  <CosmicButton
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(course.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </CosmicButton>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {course.total_students || 0}
                </span>
                {course.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {course.rating.toFixed(1)}
                  </span>
                )}
                <span className="flex items-center gap-1">₹{course.price}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}