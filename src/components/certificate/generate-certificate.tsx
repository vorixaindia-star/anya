'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { GlassCard } from '@/components/ui/glass-card'
import { toast } from 'sonner'
import { Award, Download, Loader2 } from 'lucide-react'

interface GenerateCertificateProps {
  studentId: string
  courseId: string
  courseName: string
  studentName: string
  onGenerated?: () => void
}

export function GenerateCertificate({
  studentId,
  courseId,
  courseName,
  studentName,
  onGenerated,
}: GenerateCertificateProps) {
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [certificateUrl, setCertificateUrl] = useState('')

  const generateCertificate = async () => {
    setLoading(true)

    try {
      const { data: existing } = await supabase
        .from('certificates')
        .select('id, download_url')
        .eq('student_id', studentId)
        .eq('course_id', courseId)
        .single()

      if (existing) {
        setCertificateUrl(existing.download_url || '')
        setGenerated(true)
        toast.info('Certificate already generated')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('certificates')
        .insert([{
          student_id: studentId,
          course_id: courseId,
          issue_date: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error

      const url = `/api/certificates/generate/${data.id}`
      setCertificateUrl(url)
      setGenerated(true)
      toast.success('Certificate generated! 🎉')
      onGenerated?.()
    } catch (error: any) {
      toast.error('Failed to generate certificate: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (generated && certificateUrl) {
    return (
      <GlassCard padding="md" className="border-emerald-500/20 bg-emerald-500/5 text-center">
        <Award className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold">Certificate Ready!</h3>
        <p className="text-sm text-muted-foreground">Your certificate has been generated</p>
        <div className="mt-4 flex justify-center gap-3">
          <a href={certificateUrl} target="_blank" rel="noopener noreferrer">
            <CosmicButton size="sm" glow icon={<Download className="h-4 w-4" />}>
              Download Certificate
            </CosmicButton>
          </a>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard padding="md" className="border-purple-500/20 bg-purple-500/5">
      <div className="flex flex-col items-center text-center">
        <Award className="h-12 w-12 text-purple-400 mb-3" />
        <h3 className="text-lg font-semibold">Get Your Certificate</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Complete the course to earn your certificate
        </p>
        <CosmicButton
          className="mt-4"
          glow
          onClick={generateCertificate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Award className="mr-2 h-4 w-4" />
              Generate Certificate
            </>
          )}
        </CosmicButton>
      </div>
    </GlassCard>
  )
}