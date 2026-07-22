'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { CourseForm } from '@/components/course/course-form'
import { toast } from 'sonner'

export default function NewCoursePage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (data: any) => {
    if (!user) {
      toast.error('You must be logged in')
      return
    }

    const { error } = await supabase
      .from('courses')
      .insert([
        {
          title: data.title,
          subtitle: data.subtitle || '',
          description: data.description,
          price: data.price,
          category: data.category,
          level: data.level,
          thumbnail_url: data.thumbnail_url || '',
          instructor_id: user.id,
          status: 'draft',
        },
      ])

    if (error) {
      toast.error('Failed to create course: ' + error.message)
      return
    }

    toast.success('Course created successfully! 🎉')
    router.push('/instructor/courses')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Course</h1>
      <p className="text-muted-foreground mb-8">Share your knowledge with the world</p>
      <CourseForm onSubmit={handleSubmit} />
    </div>
  )
}