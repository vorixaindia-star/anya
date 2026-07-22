'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Course, Module } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { ModuleList } from '@/components/lesson/module-list'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function StudentCourseDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [enrollment, setEnrollment] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !id) return

      // Fetch course
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()

      setCourse(courseData)

      // Fetch modules with lessons
      const { data: moduleData } = await supabase
        .from('modules')
        .select(`
          *,
          lessons (*)
        `)
        .eq('course_id', id)
        .order('order', { ascending: true })

      setModules(moduleData || [])

      // Fetch enrollment
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select('*')
        .eq('student_id', user.id)
        .eq('course_id', id)
        .single()

      setEnrollment(enrollmentData)
      setLoading(false)
    }

    fetchData()
  }, [id, user])

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>
  if (!course) return <div className="max-w-4xl mx-auto px-4 py-8">Course not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <a href="/student/courses">
          <CosmicButton variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </CosmicButton>
        </a>
        <h1 className="text-2xl font-bold">{course.title}</h1>
      </div>

      <GlassCard padding="lg" className="mb-8">
        <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          {course.thumbnail_url ? (
            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-20 w-20 text-purple-400/50" />
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="text-muted-foreground">{course.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="px-3 py-1 rounded-full glass border border-white/10">{course.level}</span>
            <span className="px-3 py-1 rounded-full glass border border-white/10">{course.category}</span>
          </div>
        </div>
      </GlassCard>

      <h2 className="text-xl font-semibold mb-4">Course Content</h2>
      {modules.length === 0 ? (
        <GlassCard padding="lg" className="text-center py-12">
          <p className="text-muted-foreground">No content available yet.</p>
        </GlassCard>
      ) : (
        <ModuleList modules={modules} courseId={id as string} isInstructor={false} />
      )}
    </div>
  )
}