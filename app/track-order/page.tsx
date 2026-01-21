'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Order {
  orderId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  cartItems: any[]
  totalPrice: number
  orderStatus: string
  paymentStatus: string
  createdAt: string
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      if (!orderId.trim() || !phone.trim()) {
        throw new Error('Please enter both Order ID and phone number')
      }

      const response = await fetch(
        `/api/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`
      )
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Order not found')
      }

      setOrder(data.order)
    } catch (err: any) {
      setError(err.message || 'Failed to track order')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-purple-100 text-purple-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">🔍 Track Your Order</h1>
      <p className="text-gray-600 mb-8">Enter your Order ID and phone number to track your order</p>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="card p-8 mb-8">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block font-bold mb-2">Order ID *</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g., ORD-20260121-1234"
              required
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">You received this in your confirmation</p>
          </div>

          <div>
            <label className="block font-bold mb-2">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +1234567890"
              required
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Phone number used during checkout</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 font-bold disabled:opacity-50"
        >
          {loading ? '⏳ Searching...' : '🔍 Track Order'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Order Details */}
      {order && (
        <div className="card p-8 space-y-8">
          {/* Order Header */}
          <div>
            <p className="text-gray-600 mb-2">Order ID</p>
            <p className="text-2xl font-bold text-primary">{order.orderId}</p>
          </div>

          {/* Status Section */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">📦 Order Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm mb-2">Order Status</p>
                <p className={`inline-block px-4 py-2 rounded-full font-bold ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm mb-2">Payment Status</p>
                <p className={`inline-block px-4 py-2 rounded-full font-bold ${getStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-bold mb-6">📅 Status Timeline</h3>
            <div className="space-y-4">
              {[
                { status: 'Pending', icon: '📋', desc: 'Order received' },
                { status: 'Processing', icon: '⚙️', desc: 'Processing your order' },
                { status: 'Shipped', icon: '🚚', desc: 'On the way' },
                { status: 'Delivered', icon: '✅', desc: 'Delivered' },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="text-2xl">{step.icon}</div>
                  <div>
                    <p className="font-bold">{step.status}</p>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                    {order.orderStatus === step.status && (
                      <p className="text-primary text-sm font-bold mt-1">← Your order is here</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-bold mb-4">👤 Customer Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Name:</span> <span className="font-bold">{order.customerName}</span></p>
              <p><span className="text-gray-600">Phone:</span> <span className="font-bold">{order.customerPhone}</span></p>
              <p><span className="text-gray-600">Address:</span> <span className="font-bold">{order.customerAddress}, {order.customerCity}</span></p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-bold mb-4">📦 Order Items</h3>
            <div className="space-y-2">
              {order.cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2">
                  <span className="text-gray-600">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="font-bold">PKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-primary">PKR {order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="border-t pt-8 bg-blue-50 p-4 rounded-lg">
            <p className="font-bold mb-2">💬 Need Help?</p>
            <p className="text-sm text-gray-600 mb-3">Contact our support team</p>
            <p className="text-sm">📧 support@universalstore.com</p>
            <p className="text-sm">📱 +1 (555) 123-4567</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!order && !loading && (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">📍</p>
          <p className="text-gray-500">Enter your details above to track your order</p>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Link href="/" className="btn-outline">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
