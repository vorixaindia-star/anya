'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { ArrowLeft, Edit, Trash2, Eye, Users, Star } from 'lucide-react'

export default function InstructorCourseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .eq('instructor_id', user.id)
        .single()

      if (error || !data) {
        toast.error('Course not found')
        router.push('/instructor/courses')
        return
      }

      setCourse(data)
      setLoading(false)
    }

    if (id) fetchCourse()
  }, [id, user, router])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course?')) return

    const { error } = await supabase.from('courses').delete().eq('id', id)

    if (error) {
      toast.error('Failed to delete course')
      return
    }

    toast.success('Course deleted successfully')
    router.push('/instructor/courses')
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-muted/50 rounded shimmer" />
        <div className="mt-4 h-64 w-full bg-muted/50 rounded shimmer" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Course not found</p>
        <CosmicButton className="mt-4" onClick={() => router.push('/instructor/courses')}>
          Back to Courses
        </CosmicButton>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-4">
        <button
          onClick={() => router.push('/instructor/courses')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>
      </div>

      <GlassCard padding="lg">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
            {course.subtitle && (
              <p className="text-muted-foreground mt-1">{course.subtitle}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
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
          <div className="flex flex-wrap gap-2">
            <CosmicButton
              size="sm"
              variant="outline"
              onClick={() => window.open(`/courses/${course.id}`, '_blank')}
            >
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </CosmicButton>
            <CosmicButton
              size="sm"
              variant="outline"
              onClick={() => router.push(`/instructor/courses/${course.id}/edit`)}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </CosmicButton>
            <CosmicButton size="sm" variant="outline" onClick={handleDelete}>
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </CosmicButton>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-lg font-bold gradient-text">₹{course.price}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Students</p>
            <p className="text-lg font-bold">{course.total_students || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rating</p>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <p className="text-lg font-bold">{course.rating || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <CosmicButton
            variant="outline"
            onClick={() => router.push(`/instructor/courses/${course.id}/modules`)}
          >
            Manage Modules
          </CosmicButton>
        </div>
      </GlassCard>
    </div>
  )
}