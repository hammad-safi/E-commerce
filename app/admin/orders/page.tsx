'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface OrderItem {
  productId: string
  title: string
  price: number
  quantity: number
  image: string
}

interface Order {
  _id: string
  orderId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  totalPrice: number
  orderStatus: string
  paymentStatus: string
  paymentMethod: string
  cartItems: OrderItem[]
  createdAt: string
}

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders)
        // Initialize selected status for each order
        const statusMap: Record<string, string> = {}
        data.orders.forEach((order: Order) => {
          statusMap[order._id] = order.orderStatus
        })
        setSelectedStatus(statusMap)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, orderDbId: string) => {
    try {
      const newStatus = selectedStatus[orderDbId]
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        alert('Order status updated successfully!')
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-primary hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-8">📋 All Orders</h1>

      {orders.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-500 text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex gap-4 mb-2">
                    <h3 className="font-bold text-lg">{order.orderId}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[order.orderStatus] || 'bg-gray-100'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    👤 {order.customerName} | 📱 {order.customerPhone}
                  </p>
                  <p className="text-gray-600">
                    📍 {order.customerAddress}, {order.customerCity}
                  </p>
                  <p className="text-gray-600">
                    💳 {order.paymentMethod} ({order.paymentStatus})
                  </p>
                  <p className="text-primary font-bold mt-2">PKR {order.totalPrice.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="w-full md:w-auto space-y-2">
                  <select
                    value={selectedStatus[order._id] || order.orderStatus}
                    onChange={(e) =>
                      setSelectedStatus({
                        ...selectedStatus,
                        [order._id]: e.target.value,
                      })
                    }
                    className="w-full md:w-40 px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleStatusUpdate(order.orderId, order._id)}
                    className="w-full btn-primary py-2 text-sm"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <button
                onClick={() =>
                  setExpandedOrder(expandedOrder === order._id ? null : order._id)
                }
                className="mt-4 text-primary hover:underline text-sm"
              >
                {expandedOrder === order._id ? '▼ Hide Items' : '▶ Show Items'}
              </button>

              {expandedOrder === order._id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-bold mb-3">Order Items:</h4>
                  {order.cartItems && order.cartItems.length > 0 ? (
                    <div className="space-y-2">
                      {order.cartItems.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded">
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × PKR {item.price.toLocaleString()} = PKR{' '}
                            {(item.quantity * item.price).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No items</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
