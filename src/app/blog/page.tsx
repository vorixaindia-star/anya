import { GlassCard } from '@/components/ui/glass-card'

export default function BlogPage() {
  const posts = [
    { title: 'Introduction to Vastu Shastra', date: 'July 20, 2026', excerpt: 'Learn the basics of Vastu and how to apply it in your home.' },
    { title: 'Understanding Your Birth Chart', date: 'July 18, 2026', excerpt: 'A beginner-friendly guide to reading your astrological chart.' },
    { title: 'Tarot 101: The Major Arcana', date: 'July 15, 2026', excerpt: 'Explore the meaning of the 22 Major Arcana cards.' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
      <div className="space-y-4">
        {posts.map((post, i) => (
          <GlassCard key={i} padding="md">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p className="text-sm text-muted-foreground">{post.date}</p>
            <p className="text-muted-foreground mt-2">{post.excerpt}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}