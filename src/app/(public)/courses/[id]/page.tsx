'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Course } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { RazorpayButton } from '@/components/payment/razorpay-button'
import { BookOpen, Users, Star, Clock, Tag } from 'lucide-react'

export default function CourseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) setCourse(data)
      setLoading(false)
    }

    if (id) fetchCourse()
  }, [id])

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>
  }

  if (!course) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Course not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <GlassCard padding="lg" className="mb-8">
        <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-6">
          {course.thumbnail_url ? (
            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-20 w-20 text-purple-400/50" />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
        {course.subtitle && (
          <p className="text-lg text-muted-foreground mt-2">{course.subtitle}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="px-3 py-1 rounded-full glass border border-white/10">{course.level}</span>
          <span className="px-3 py-1 rounded-full glass border border-white/10">{course.category}</span>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.total_students || 0} students</span>
          </div>
          {course.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="mt-6 prose prose-invert max-w-none">
          <p>{course.description}</p>
        </div>

        <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/5">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-3xl font-bold gradient-text">₹{course.price}</p>
          </div>
          <RazorpayButton
            amount={course.price}
            courseId={course.id}
            courseName={course.title}
            onSuccess={() => {
              router.push('/student/courses')
            }}
            label={`Enroll Now - ₹${course.price}`}
          />
        </div>
      </GlassCard>
    </div>
  )
}