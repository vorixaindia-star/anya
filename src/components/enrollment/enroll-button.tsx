'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { toast } from 'sonner'

interface EnrollButtonProps {
  courseId: string
  price: number
  onSuccess?: () => void
}

export function EnrollButton({ courseId, price, onSuccess }: EnrollButtonProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll')
      router.push('/login')
      return
    }

    setLoading(true)

    // Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (existing) {
      toast.info('You are already enrolled in this course')
      setLoading(false)
      return
    }

    // Create enrollment (free courses only for now)
    const { error } = await supabase
      .from('enrollments')
      .insert([
        {
          student_id: user.id,
          course_id: courseId,
          progress: 0,
          completed: false,
        },
      ])

    if (error) {
      toast.error('Failed to enroll: ' + error.message)
    } else {
      toast.success('Successfully enrolled! 🎉')
      // Update course total students
      await supabase.rpc('increment_course_students', { course_id: courseId })
      onSuccess?.()
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <CosmicButton 
      size="lg" 
      glow 
      fullWidth 
      onClick={handleEnroll} 
      disabled={loading}
    >
      {loading ? 'Enrolling...' : price === 0 ? 'Enroll Now (Free)' : `Enroll Now - ₹${price}`}
    </CosmicButton>
  )
}