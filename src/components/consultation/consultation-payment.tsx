'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { toast } from 'sonner'
import { Loader2, Calendar, Clock, User, Video } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface ConsultationPaymentProps {
  expertId: string
  expertName: string
  amount: number
  duration: number
  scheduledAt: string
  studentId: string
}

export function ConsultationPayment({
  expertId,
  expertName,
  amount,
  duration,
  scheduledAt,
  studentId,
}: ConsultationPaymentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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
    try {
      setLoading(true)

      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        toast.error('Payment gateway not available')
        return
      }

      // Create order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `consultation_${expertId}`,
        }),
      })

      const { success, orderId, amount: orderAmount, currency } = await response.json()

      if (!success) {
        toast.error('Failed to create payment order')
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency,
        name: 'Anya Academy',
        description: `Consultation with ${expertName}`,
        order_id: orderId,
        handler: async (response: any) => {
          // Save consultation after payment
          const { error } = await supabase.from('consultations').insert([
            {
              student_id: studentId,
              expert_id: expertId,
              scheduled_at: scheduledAt,
              duration,
              status: 'confirmed',
              payment_id: response.razorpay_payment_id,
            },
          ])

          if (error) {
            toast.error('Payment successful but booking failed. Contact support.')
            return
          }

          toast.success('Consultation booked successfully! 🎉')
          router.push('/student/consultations')
        },
        prefill: {
          name: 'Student',
          email: 'student@example.com',
        },
        theme: { color: '#6C3B9A' },
        modal: { ondismiss: () => setLoading(false) },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard padding="lg" className="border-purple-500/20 bg-purple-500/5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Consultation with {expertName}</h3>
            <p className="text-sm text-muted-foreground">One-on-one session</p>
          </div>
          <span className="text-2xl font-bold gradient-text">₹{amount}</span>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-400" />
            <span>{new Date(scheduledAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span>{new Date(scheduledAt).toLocaleTimeString()} ({duration} min)</span>
          </div>
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-purple-400" />
            <span>Zoom/Google Meet session</span>
          </div>
        </div>

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
            `Pay ₹${amount} & Book Now`
          )}
        </CosmicButton>

        <p className="text-xs text-muted-foreground text-center">
          🔒 Secure payment via Razorpay. Free cancellation within 24 hours.
        </p>
      </div>
    </GlassCard>
  )
}