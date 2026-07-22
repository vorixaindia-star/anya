import { RegisterForm } from '@/components/auth/register-form'
import { GlassCard } from '@/components/ui/glass-card'

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-[80vh] max-w-md items-center justify-center px-4">
      <GlassCard padding="lg" className="w-full border-purple-500/10">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
            <p className="text-sm text-muted-foreground">Start your learning journey today</p>
          </div>
          <RegisterForm />
        </div>
      </GlassCard>
    </div>
  )
}