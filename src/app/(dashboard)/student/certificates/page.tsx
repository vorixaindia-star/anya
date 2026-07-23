'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Award, Download, Calendar, BookOpen } from 'lucide-react'

export default function CertificatesPage() {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          course:course_id (
            title,
            level,
            instructor:instructor_id (full_name)
          )
        `)
        .eq('student_id', user.id)
        .order('issue_date', { ascending: false })

      if (!error && data) setCertificates(data)
      setLoading(false)
    }

    fetchCertificates()
  }, [user])

  if (!user) {
    return <div className="text-center py-20">Please login to view your certificates</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
      <div className="flex items-center gap-3 mb-8">
        <Award className="h-8 w-8 text-purple-400" />
        <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} padding="sm" className="h-32 shimmer">
            <div className="h-full w-full shimmer" />
          </GlassCard>
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <GlassCard padding="lg" className="text-center py-12">
          <Award className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No certificates yet</h3>
          <p className="text-muted-foreground">Complete a course to earn your certificate</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <GlassCard key={cert.id} padding="md">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Award className="h-8 w-8 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{cert.course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cert.course.level} • by {cert.course.instructor.full_name}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(cert.issue_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {cert.certificate_number}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`/api/certificates/generate/${cert.id}`} target="_blank">
                    <CosmicButton size="sm" variant="outline" icon={<Download className="h-4 w-4" />}>
                      Download
                    </CosmicButton>
                  </a>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}