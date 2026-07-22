import { GlassCard } from '@/components/ui/glass-card'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
      <GlassCard padding="lg">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-purple-400" />
            <span>support@anya.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-purple-400" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-purple-400" />
            <span>India</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-purple-400" />
            <span>24/7 Support Available</span>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}