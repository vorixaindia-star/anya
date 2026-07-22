'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CosmicButton } from '@/components/ui/cosmic-button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })
      if (error) throw error
      setSent(true)
      toast.success('Password reset link sent!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset link.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Check your inbox</h3>
          <p className="text-sm text-muted-foreground mt-1">We've sent a password reset link to your email address.</p>
        </div>
        <a href="/login">
          <CosmicButton variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>Back to login</CosmicButton>
        </a>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10 bg-white/5 border-white/10" placeholder="you@example.com" type="email" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CosmicButton type="submit" size="lg" glow fullWidth disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
        </CosmicButton>

        <div className="text-center text-sm text-muted-foreground">
          Remember your password? <a href="/login" className="text-primary hover:underline">Sign in</a>
        </div>
      </form>
    </Form>
  )
}