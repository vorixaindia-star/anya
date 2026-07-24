'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { RazorpayButton } from '@/components/payment/razorpay-button'
import { Trash2, ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { CartItem } from '@/types'

export default function CartPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:product_id (
            id,
            name,
            price,
            images,
            slug
          )
        `)
        .eq('user_id', user.id)

      if (!error && data) {
        setCartItems(data)
        const sum = data.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0)
        setTotal(sum)
      }
      setLoading(false)
    }

    fetchCart()
  }, [user])

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId)
      return
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId)

    if (error) {
      toast.error('Failed to update quantity')
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ))
      // Recalculate total
      const newTotal = cartItems.reduce((acc, item) => 
        acc + (item.product?.price || 0) * (item.id === itemId ? newQuantity : item.quantity), 0)
      setTotal(newTotal)
    }
  }

  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (error) {
      toast.error('Failed to remove item')
    } else {
      setCartItems(prev => prev.filter(item => item.id !== itemId))
      toast.success('Item removed')
    }
  }

  if (!user) {
    return <div className="text-center py-20">Please login to view cart</div>
  }

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">Start shopping at our store</p>
        <CosmicButton className="mt-4" onClick={() => router.push('/store')}>
          Browse Products
        </CosmicButton>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold tracking-tight mb-8">🛒 Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <GlassCard key={item.id} padding="md">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted/20 flex items-center justify-center flex-shrink-0">
                  {item.product?.images && item.product.images[0] ? (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover rounded" />
                  ) : (
                    <span className="text-2xl">🔮</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{item.product?.name}</h3>
                  <p className="text-sm text-muted-foreground">₹{item.product?.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/10 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-white/5 transition"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-white/5 transition"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard padding="lg" className="mt-6">
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="gradient-text">₹{total}</span>
        </div>
        <RazorpayButton
          amount={total}
          itemId="cart"
          itemName="Store Purchase"
          type="product"
          label={`Checkout - ₹${total}`}
          onSuccess={() => {
            toast.success('Order placed! 🎉')
            // Clear cart
            setCartItems([])
          }}
        />
      </GlassCard>
    </div>
  )
}