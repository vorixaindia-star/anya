'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { RazorpayButton } from '@/components/payment/razorpay-button'
import { ShoppingCart, Heart, Star, Share2, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          vendor:vendors (
            business_name
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (!error && data) {
        setProduct(data)
      } else {
        toast.error('Product not found')
        router.push('/store')
      }
      setLoading(false)
    }

    if (slug) fetchProduct()
  }, [slug, router])

  const addToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart')
      return
    }
    if (!product) return

    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
      if (!error) {
        toast.success('Cart updated!')
        setAddedToCart(true)
      }
      return
    }

    const { error } = await supabase
      .from('cart_items')
      .insert([{ user_id: user.id, product_id: product.id, quantity }])

    if (error) {
      toast.error('Failed to add to cart')
    } else {
      toast.success('Added to cart! 🛒')
      setAddedToCart(true)
    }
  }

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  if (!product) return null

  return (
    <div className="min-h-screen bg-muted/5 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <GlassCard padding="md" className="overflow-hidden">
            <div className="aspect-square rounded-lg bg-muted/20 flex items-center justify-center">
              {product.images && product.images[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl">🔮</span>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {product.images.map((img, i) => (
                  <img key={i} src={img} alt="" className="w-16 h-16 rounded object-cover" />
                ))}
              </div>
            )}
          </GlassCard>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground">{product.vendor?.business_name || 'Vendor'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.rating || '0'}</span>
                <span className="text-muted-foreground text-sm">({product.total_reviews || 0} reviews)</span>
              </div>
            </div>

            <div>
              <span className="text-3xl font-bold gradient-text">₹{product.price}</span>
              {product.compare_price && (
                <span className="ml-2 text-muted-foreground line-through">₹{product.compare_price}</span>
              )}
              <div className="mt-1 text-sm text-muted-foreground">Inclusive of all taxes</div>
            </div>

            <div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-white/10 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-white/5 transition"
                >
                  −
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-white/5 transition"
                >
                  +
                </button>
              </div>
              <CosmicButton 
                glow 
                onClick={addToCart}
                disabled={product.stock === 0 || addedToCart}
                icon={<ShoppingCart className="h-4 w-4" />}
              >
                {addedToCart ? 'Added!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </CosmicButton>
            </div>

            {product.stock > 0 && (
              <RazorpayButton
                amount={product.price * quantity}
                itemId={product.id}
                itemName={product.name}
                type="product"
                label={`Buy Now - ₹${product.price * quantity}`}
              />
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-400" /> In stock</span>
              <span>•</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-400" /> Free shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}