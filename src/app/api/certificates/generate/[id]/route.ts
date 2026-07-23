import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()
  
  const { data: certificate, error } = await supabase
    .from('certificates')
    .select(`
      *,
      student:users(full_name, email),
      course:courses(title, level, instructor:instructor_id(full_name))
    `)
    .eq('id', params.id)
    .single()

  if (error || !certificate) {
    return new NextResponse('Certificate not found', { status: 404 })
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Georgia', serif; background: #0a0a0a; color: #fff; margin: 0; padding: 40px; }
        .certificate { border: 4px solid #8B5CF6; border-radius: 20px; padding: 60px; max-width: 800px; margin: 0 auto; text-align: center; background: linear-gradient(135deg, #0c0c1d, #1a0b2e); }
        h1 { font-size: 48px; background: linear-gradient(135deg, #a78bfa, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
        .gold { color: #F5A623; font-size: 24px; }
        .name { font-size: 36px; font-weight: bold; margin: 20px 0; }
        .course { font-size: 24px; color: #a78bfa; }
        .footer { margin-top: 40px; font-size: 14px; color: #666; border-top: 1px solid #333; padding-top: 20px; }
        .number { font-size: 12px; color: #444; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="certificate">
        <h1>Certificate of Completion</h1>
        <p class="gold">🎓 This certificate is proudly presented to</p>
        <p class="name">${certificate.student.full_name}</p>
        <p>for successfully completing</p>
        <p class="course">${certificate.course.title}</p>
        <p style="color: #888;">Level: ${certificate.course.level}</p>
        <p style="color: #888; font-size: 14px;">Instructor: ${certificate.course.instructor.full_name}</p>
        <p style="color: #888;">Issued on: ${new Date(certificate.issue_date).toLocaleDateString()}</p>
        <p class="number">Certificate No: ${certificate.certificate_number}</p>
        <div class="footer">© Anya — AI-Powered Spiritual Learning Platform</div>
      </div>
    </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}