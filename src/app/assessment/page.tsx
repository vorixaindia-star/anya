import AIAssessmentSection from '@/components/sections/AIAssessmentSection'

export default function AssessmentPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">AI Skill Assessment</h1>
      <p className="text-muted-foreground mb-8">Discover your current level and get personalized learning recommendations.</p>
      <AIAssessmentSection />
    </div>
  )
}