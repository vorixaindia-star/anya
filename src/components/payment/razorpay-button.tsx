'use client'

import { useState } from 'react'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayButtonProps {
  amount: number
  courseId: string
  courseName: string
  onSuccess?: () => void
  label?: string
}

export function RazorpayButton({
  amount,
  courseId,
  courseName,
  onSuccess,
  label = 'Enroll Now',
}: RazorpayButtonProps) {
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

      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `course_${courseId}`,
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
        description: `Enrollment for ${courseName}`,
        order_id: orderId,
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          })

          const { success: verified } = await verifyRes.json()

          if (verified) {
            toast.success('Payment successful! You are now enrolled.')
            onSuccess?.()
          } else {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: 'Student',
          email: 'student@example.com',
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
      toast.error('Something went wrong')
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
        label
      )}
    </CosmicButton>
  )
}