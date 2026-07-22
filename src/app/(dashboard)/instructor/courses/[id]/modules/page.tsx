'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Module } from '@/types'
import { ModuleList } from '@/components/lesson/module-list'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { GlassCard } from '@/components/ui/glass-card'
import { PlusCircle, ArrowLeft } from 'lucide-react'

export default function CourseModulesPage() {
  const { id } = useParams()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [courseTitle, setCourseTitle] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      // Fetch course
      const { data: course } = await supabase
        .from('courses')
        .select('title')
        .eq('id', id)
        .single()
      
      if (course) setCourseTitle(course.title)

      // Fetch modules with lessons
      const { data, error } = await supabase
        .from('modules')
        .select(`
          *,
          lessons (*)
        `)
        .eq('course_id', id)
        .order('order', { ascending: true })

      if (!error && data) setModules(data)
      setLoading(false)
    }

    if (id) fetchData()
  }, [id])

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <a href={`/instructor/courses/${id}`}>
          <CosmicButton variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </CosmicButton>
        </a>
        <h1 className="text-2xl font-bold">{courseTitle} - Modules</h1>
      </div>

      <div className="flex justify-end mb-6">
        <a href={`/instructor/courses/${id}/modules/new`}>
          <CosmicButton glow icon={<PlusCircle className="h-4 w-4" />}>
            Add Module
          </CosmicButton>
        </a>
      </div>

      {modules.length === 0 ? (
        <GlassCard padding="lg" className="text-center py-12">
          <p className="text-muted-foreground">No modules yet. Create your first module!</p>
        </GlassCard>
      ) : (
        <ModuleList modules={modules} courseId={id as string} isInstructor />
      )}
    </div>
  )
}