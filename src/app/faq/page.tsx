import { GlassCard } from '@/components/ui/glass-card'

export default function FAQPage() {
  const faqs = [
    { q: 'What is Anya?', a: 'Anya is an AI-powered spiritual learning platform offering courses, consultations, and products in Vastu, Astrology, Numerology, Tarot, Reiki, and Healing.' },
    { q: 'How do I enroll in a course?', a: 'Browse courses, click "Enroll", complete payment, and start learning immediately.' },
    { q: 'Are the gurus verified?', a: 'Yes, all gurus are verified through a rigorous process including credentials, experience, and student reviews.' },
    { q: 'Can I get a certificate?', a: 'Yes, upon completing a course, you will receive a certificate that you can download and share.' },
    { q: 'What is the refund policy?', a: 'We offer a 14-day money-back guarantee for all courses. Consultations are non-refundable once confirmed.' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((item, i) => (
          <GlassCard key={i} padding="md">
            <h3 className="font-semibold text-lg">{item.q}</h3>
            <p className="text-muted-foreground">{item.a}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}