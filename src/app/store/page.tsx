'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Input } from '@/components/ui/input'
import { 
  Search, ShoppingCart, Heart, Star, Filter,
  Grid3X3, List, ChevronRight, X, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Product } from '@/types'

export default function StorePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [categories, setCategories] = useState<string[]>([])
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          vendor:vendors (
            business_name
          )
        `)
        .eq('is_active', true)

      if (category !== 'all') {
        query = query.eq('category', category)
      }

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (!error && data) {
        setProducts(data)
        const cats = [...new Set(data.map(p => p.category).filter(Boolean))]
        setCategories(cats as string[])
      }
      setLoading(false)
    }

    const fetchCart = async () => {
      if (!user) return
      const { data } = await supabase
        .from('cart_items')
        .select('id')
        .eq('user_id', user.id)
      setCartCount(data?.length || 0)
    }

    fetchProducts()
    fetchCart()
  }, [category, search, user])

  const addToCart = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add items to cart')
      return
    }

    // Check if already in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single()

    if (existing) {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id)
      if (!error) {
        toast.success('Quantity updated!')
        setCartCount(prev => prev + 1)
      } else {
        toast.error('Failed to update cart')
      }
      return
    }

    const { error } = await supabase
      .from('cart_items')
      .insert([{ user_id: user.id, product_id: productId, quantity: 1 }])

    if (error) {
      toast.error('Failed to add to cart')
    } else {
      toast.success('Added to cart! 🛒')
      setCartCount(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-muted/5 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">🛍️ Occult Store</h1>
            <p className="text-muted-foreground">Crystals, Rudraksha, Yantras & more</p>
          </div>
          <Link href="/cart" className="relative">
            <button className="p-2 rounded-lg glass hover:bg-white/5 transition">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-purple-500 text-xs flex items-center justify-center text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 bg-white/5 border-white/10"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg glass hover:bg-white/5 transition"
          >
            {view === 'grid' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </button>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <GlassCard key={i} padding="sm" className="h-80 shimmer">
                <div className="h-full w-full shimmer" />
              </GlassCard>
            ))}
          </div>
        ) : products.length === 0 ? (
          <GlassCard padding="lg" className="text-center py-20">
            <p className="text-muted-foreground">No products found</p>
          </GlassCard>
        ) : (
          <div className={`grid ${view === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-4`}>
            {products.map((product) => (
              <GlassCard key={product.id} hover padding="sm" className="relative">
                <Link href={`/store/product/${product.slug}`}>
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted/20 relative">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🔮</div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-white font-bold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="mt-3">
                  <Link href={`/store/product/${product.slug}`}>
                    <h3 className="font-semibold hover:text-primary transition line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-1">{product.vendor?.business_name || 'Vendor'}</p>

                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating || '0'}</span>
                    <span className="text-xs text-muted-foreground">({product.total_reviews || 0})</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <div>
                      <span className="text-lg font-bold gradient-text">₹{product.price}</span>
                      {product.compare_price && (
                        <span className="ml-1 text-xs text-muted-foreground line-through">₹{product.compare_price}</span>
                      )}
                    </div>
                    <CosmicButton 
                      size="sm" 
                      glow 
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock === 0}
                      icon={<ShoppingCart className="h-3 w-3" />}
                    >
                      {product.stock > 0 ? 'Add' : 'Sold'}
                    </CosmicButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}