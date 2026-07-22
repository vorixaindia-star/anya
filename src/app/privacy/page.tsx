import { GlassCard } from '@/components/ui/glass-card'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
      <GlassCard padding="lg">
        <p className="text-muted-foreground">
          At Anya, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
          <li>We collect only the information you provide (name, email, payment details).</li>
          <li>We use your data to provide services, process payments, and improve your experience.</li>
          <li>We do not share your data with third parties except as required for payment processing.</li>
          <li>You can request deletion of your account and data at any time.</li>
        </ul>
      </GlassCard>
    </div>
  )
}