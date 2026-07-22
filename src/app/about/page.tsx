import { GlassCard } from '@/components/ui/glass-card'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">About Anya</h1>
      <GlassCard padding="lg">
        <p className="text-muted-foreground">
          Anya is India's premier AI-powered spiritual learning platform. We connect seekers with verified gurus
          in Vastu, Astrology, Numerology, Tarot, Reiki, and Healing. Our AI mentor provides personalized guidance,
          and our marketplace offers courses, consultations, and products — all in one ecosystem.
        </p>
        <p className="text-muted-foreground mt-4">
          Founded with a mission to make ancient wisdom accessible to everyone, Anya combines traditional knowledge
          with modern technology to transform lives.
        </p>
      </GlassCard>
    </div>
  )
}