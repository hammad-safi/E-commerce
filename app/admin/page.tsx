'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Order {
  _id: string
  orderId: string
  customerName: string
  totalPrice: number
  orderStatus: string
  createdAt: string
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders.slice(0, 5)) // Show 5 recent orders
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">📊 Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <p className="text-gray-600 mb-2">Total Orders</p>
          <p className="text-4xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="card p-6">
          <p className="text-gray-600 mb-2">Total Revenue</p>
          <p className="text-4xl font-bold text-primary">PKR {stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="card p-6">
          <p className="text-gray-600 mb-2">Pending Orders</p>
          <p className="text-4xl font-bold text-yellow-600">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/products" className="card p-6 hover:shadow-lg transition cursor-pointer">
          <p className="text-3xl mb-2">📦</p>
          <h3 className="font-bold text-lg">Manage Products</h3>
          <p className="text-gray-600 text-sm">Add, edit, and remove products</p>
        </Link>

        <Link href="/admin/orders" className="card p-6 hover:shadow-lg transition cursor-pointer">
          <p className="text-3xl mb-2">📋</p>
          <h3 className="font-bold text-lg">View Orders</h3>
          <p className="text-gray-600 text-sm">Manage customer orders</p>
        </Link>

        <Link href="/admin/analytics" className="card p-6 hover:shadow-lg transition cursor-pointer">
          <p className="text-3xl mb-2">📈</p>
          <h3 className="font-bold text-lg">Analytics</h3>
          <p className="text-gray-600 text-sm">View sales and revenue charts</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold mb-6">📋 Recent Orders</h2>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold">{order.orderId}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4 font-bold">PKR {order.totalPrice.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-center">
              <Link href="/admin/orders" className="btn-primary">
                View All Orders →
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No orders yet</p>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="font-bold mb-2">✅ Admin Features Active</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✓ Real-time order tracking</li>
          <li>✓ Update order status (Pending → Processing → Shipped → Delivered)</li>
          <li>✓ View customer details and payment info</li>
          <li>✓ Monitor total revenue and pending orders</li>
        </ul>
      </div>
    </div>
  )
}
