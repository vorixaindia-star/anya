'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Simple schema
const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subtitle: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().min(0, 'Price must be 0 or more'),
  category: z.string().min(1, 'Category is required'),
  level: z.string().min(1, 'Level is required'),
  thumbnail_url: z.string().optional(),
})

type CourseFormValues = z.infer<typeof courseSchema>

interface CourseFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
}

export function CourseForm({ initialData, onSubmit }: CourseFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: initialData?.title || '',
      subtitle: initialData?.subtitle || '',
      description: initialData?.description || '',
      price: initialData?.price?.toString() || '0',
      category: initialData?.category || '',
      level: initialData?.level || 'beginner',
      thumbnail_url: initialData?.thumbnail_url || '',
    },
  })

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true)
      const formattedData = {
        ...data,
        price: parseFloat(data.price),
      }
      await onSubmit(formattedData)
    } catch (error) {
      console.error('Form error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard padding="lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input className="bg-white/5 border-white/10" placeholder="e.g., Vastu for Beginners" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle (Optional)</FormLabel>
                <FormControl>
                  <Input className="bg-white/5 border-white/10" placeholder="A short tagline" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea className="bg-white/5 border-white/10 min-h-[120px]" placeholder="What will students learn?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <Input className="bg-white/5 border-white/10" type="text" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input className="bg-white/5 border-white/10" placeholder="e.g., Vastu, Astrology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thumbnail_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail URL (Optional)</FormLabel>
                <FormControl>
                  <Input className="bg-white/5 border-white/10" placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CosmicButton type="submit" size="lg" glow fullWidth disabled={loading}>
            {loading ? 'Saving...' : 'Create Course'}
          </CosmicButton>
        </form>
      </Form>
    </GlassCard>
  )
}