'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trackPurchase } from '@/lib/fbPixel'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Stripe'>('COD')
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
  })
  const [error, setError] = useState('')

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-6xl mb-4">📦</p>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add items to checkout</p>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.customerName.trim()) {
        throw new Error('Please enter your name')
      }
      if (!formData.customerPhone.trim()) {
        throw new Error('Please enter your phone number')
      }
      if (!formData.customerAddress.trim()) {
        throw new Error('Please enter your address')
      }
      if (!formData.customerCity.trim()) {
        throw new Error('Please enter your city')
      }

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cartItems: cart,
          totalPrice,
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to place order')
      }

      // Track purchase
      trackPurchase(totalPrice, 'PKR', data.orderId)

      // Save order data to localStorage for success page
      localStorage.setItem(
        'lastOrder',
        JSON.stringify({
          orderId: data.orderId,
          ...formData,
          totalPrice,
          cartItems: cart,
        })
      )

      // Clear cart
      clearCart()

      // Redirect to success page
      router.push(`/order-success/${data.orderId}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">💳 Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2">
          <div className="card p-8">
            {error && (
              <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            {/* Customer Information */}
            <h2 className="text-2xl font-bold mb-6">📋 Your Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                name="customerName"
                placeholder="Full Name *"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="col-span-2 md:col-span-1"
              />
              <input
                type="email"
                name="customerEmail"
                placeholder="Email (optional)"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="col-span-2 md:col-span-1"
              />
              <input
                type="tel"
                name="customerPhone"
                placeholder="Phone Number *"
                value={formData.customerPhone}
                onChange={handleInputChange}
                required
                className="col-span-2"
              />
            </div>

            {/* Address */}
            <h2 className="text-2xl font-bold mb-6 mt-8">📍 Delivery Address</h2>

            <textarea
              name="customerAddress"
              placeholder="Street Address *"
              value={formData.customerAddress}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full mb-4"
            ></textarea>

            <input
              type="text"
              name="customerCity"
              placeholder="City/Town *"
              value={formData.customerCity}
              onChange={handleInputChange}
              required
              className="w-full"
            />

            {/* Payment Method */}
            <h2 className="text-2xl font-bold mb-6 mt-8">💰 Payment Method</h2>

            <div className="space-y-3 mb-8">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50" style={{borderColor: paymentMethod === 'COD' ? '#FF6B35' : '#e5e7eb'}}>
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'Stripe')}
                  className="w-4 h-4"
                />
                <div className="ml-4">
                  <p className="font-bold">💵 Cash on Delivery (COD)</p>
                  <p className="text-sm text-gray-600">Pay when you receive your order</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50" style={{borderColor: paymentMethod === 'Stripe' ? '#FF6B35' : '#e5e7eb'}}>
                <input
                  type="radio"
                  value="Stripe"
                  checked={paymentMethod === 'Stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'Stripe')}
                  className="w-4 h-4"
                />
                <div className="ml-4">
                  <p className="font-bold">💳 Card Payment (Stripe)</p>
                  <p className="text-sm text-gray-600">Pay securely with your card</p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Processing...' : `✓ Place Order (PKR ${totalPrice.toLocaleString()})`}
            </button>
          </div>
        </form>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">📦 Order Summary</h2>

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span className="font-bold">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">PKR {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold">Free</span>
              </div>
              <div className="flex justify-between text-lg border-t pt-4 mt-4">
                <span className="font-bold">Total</span>
                <span className="text-primary font-bold">PKR {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <Link href="/cart" className="btn-outline w-full text-center py-2 mt-4 block">
              Edit Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
