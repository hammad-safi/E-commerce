'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils'

interface OrderData {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  totalPrice: number
  cartItems: any[]
}

export default function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to get order from localStorage first
    const savedOrder = localStorage.getItem('lastOrder')
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder))
        localStorage.removeItem('lastOrder')
      } catch (error) {
        console.error('Error parsing order:', error)
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Loading order details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Success Message */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-xl text-gray-600 mb-2">Thank you for your order</p>
        <p className="text-gray-500">We've received your order and will process it shortly</p>
      </div>

      {/* Order Details Card */}
      {order && (
        <div className="card p-8 mb-8">
          {/* Order ID */}
          <div className="mb-8 pb-8 border-b">
            <p className="text-gray-600 mb-2">Order ID</p>
            <p className="text-3xl font-bold text-primary break-all">{order.orderId}</p>
            <p className="text-sm text-gray-500 mt-2">Save this number to track your order</p>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
            <div>
              <h3 className="font-bold text-lg mb-4">📋 Customer Information</h3>
              <p><span className="text-gray-600">Name:</span> <span className="font-bold">{order.customerName}</span></p>
              <p><span className="text-gray-600">Phone:</span> <span className="font-bold">{order.customerPhone}</span></p>
              {order.customerEmail && order.customerEmail !== 'not-provided@store.com' && (
                <p><span className="text-gray-600">Email:</span> <span className="font-bold">{order.customerEmail}</span></p>
              )}
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">📍 Delivery Address</h3>
              <p className="font-bold">{order.customerAddress}</p>
              <p className="font-bold">{order.customerCity}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8 pb-8 border-b">
            <h3 className="font-bold text-lg mb-4">📦 Order Items</h3>
            <div className="space-y-2">
              {order.cartItems?.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2">
                  <span>{item.title} × {item.quantity}</span>
                  <span className="font-bold">PKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-8">
            <div className="flex justify-between text-lg mb-2">
              <span>Subtotal</span>
              <span className="font-bold">PKR {order.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg mb-2">
              <span>Shipping</span>
              <span className="font-bold">Free</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-2xl">
              <span className="font-bold">Total</span>
              <span className="text-primary font-bold">PKR {order.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* What's Next */}
      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">📌 What's Next?</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="text-3xl">1️⃣</div>
            <div>
              <p className="font-bold mb-1">Order Confirmation</p>
              <p className="text-gray-600">You'll receive an email confirmation shortly</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-3xl">2️⃣</div>
            <div>
              <p className="font-bold mb-1">Order Processing</p>
              <p className="text-gray-600">Our team will process and prepare your order</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-3xl">3️⃣</div>
            <div>
              <p className="font-bold mb-1">Shipment & Tracking</p>
              <p className="text-gray-600">Track your order using your Order ID and phone number</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Link href={`/track-order?orderId=${params.orderId}`} className="btn-primary flex-1 text-center py-3">
          🔍 Track Order
        </Link>
        <Link href="/products" className="btn-secondary flex-1 text-center py-3">
          Continue Shopping
        </Link>
      </div>

      {/* Support */}
      <div className="text-center mt-12 p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-2">Need help? Contact us</p>
        <p className="font-bold">📧 support@universalstore.com</p>
        <p className="font-bold">📱 +1 (555) 123-4567</p>
      </div>
    </div>
  )
}
