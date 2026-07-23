'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayButtonProps {
  amount: number
  itemId: string
  itemName: string
  type: 'course' | 'consultation'
  onSuccess?: () => void
  label?: string
}

export function RazorpayButton({
  amount,
  itemId,
  itemName,
  type,
  onSuccess,
  label = 'Pay Now',
}: RazorpayButtonProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  // ✅ YE FUNCTION YAHAN DALO — client-side script loader
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to continue')
      router.push('/login')
      return
    }

    if (amount <= 0) {
      await handleFreeEnrollment()
      return
    }

    try {
      setLoading(true)

      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        toast.error('Payment gateway not available')
        setLoading(false)
        return
      }

      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `${type}_${itemId}_${Date.now()}`,
          metadata: {
            itemId,
            itemName,
            type,
            userId: user.id,
          },
        }),
      })

      const { success, orderId, amount: orderAmount, currency, key, error } = await response.json()

      if (!success) {
        toast.error(error || 'Failed to create payment order')
        setLoading(false)
        return
      }

      const options = {
        key,
        amount: orderAmount,
        currency,
        name: 'Anya Academy',
        description: type === 'course' ? `Enrollment: ${itemName}` : `Consultation: ${itemName}`,
        order_id: orderId,
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount,
              courseId: type === 'course' ? itemId : undefined,
              studentId: user.id,
              type,
            }),
          })

          const { success: verified, error: verifyError } = await verifyRes.json()

          if (verified) {
            toast.success('Payment successful! 🎉')
            onSuccess?.()
            if (type === 'course') {
              router.push(`/student/courses/${itemId}`)
            } else {
              router.push('/student/consultations')
            }
          } else {
            toast.error(verifyError || 'Payment verification failed')
          }
        },
        prefill: {
          name: user.full_name || 'Student',
          email: user.email || '',
        },
        theme: {
          color: '#6C3B9A',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFreeEnrollment = async () => {
    if (!user) return
    setLoading(true)

    try {
      const { supabase } = await import('@/lib/supabase/client')
      
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', user.id)
        .eq('course_id', itemId)
        .single()

      if (existing) {
        toast.info('Already enrolled in this course')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('enrollments').insert([
        {
          student_id: user.id,
          course_id: itemId,
          progress: 0,
          completed: false,
        },
      ])

      if (error) throw error

      await supabase.rpc('increment_course_students', { course_id: itemId })

      toast.success('Enrolled successfully! 🎉')
      onSuccess?.()
      router.push(`/student/courses/${itemId}`)
    } catch (error: any) {
      toast.error(error.message || 'Enrollment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CosmicButton
      size="lg"
      glow
      fullWidth
      onClick={handlePayment}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        amount <= 0 ? 'Enroll Now (Free)' : label
      )}
    </CosmicButton>
  )
}