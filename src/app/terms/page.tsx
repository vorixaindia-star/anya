import { GlassCard } from '@/components/ui/glass-card'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
      <GlassCard padding="lg">
        <p className="text-muted-foreground">
          By using Anya, you agree to the following terms:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
          <li>You must be at least 18 years old to use this platform.</li>
          <li>All courses and consultations are for educational purposes only.</li>
          <li>We reserve the right to suspend accounts for misuse or violation of policies.</li>
          <li>Refunds are handled according to our refund policy.</li>
        </ul>
      </GlassCard>
    </div>
  )
}