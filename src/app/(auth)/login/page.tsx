import { LoginForm } from '@/components/auth/login-form'
import { GlassCard } from '@/components/ui/glass-card'

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[80vh] max-w-md items-center justify-center px-4">
      <GlassCard padding="lg" className="w-full border-purple-500/10">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">Sign in to continue your learning journey</p>
          </div>
          <LoginForm />
        </div>
      </GlassCard>
    </div>
  )
}