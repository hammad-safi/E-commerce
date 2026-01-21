'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Analytics {
  overview: {
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
    completedOrders: number
    productCount: number
    avgOrderValue: number
  }
  revenueByDate: Record<string, number>
  topProducts: Array<{ productId: string; count: number; revenue: number }>
  categoryStats: Record<string, { count: number; products: number }>
  conversionRate: string
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/analytics')
      const data = await res.json()

      if (data.success) {
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Loading analytics...</p>
      </div>
    )
  }

  const revenueChartData = Object.entries(analytics.revenueByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-primary hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-8">📈 Analytics & Reports</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-gray-600 text-sm mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-primary">{analytics.overview.totalOrders}</p>
        </div>

        <div className="card p-4 text-center">
          <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">PKR {analytics.overview.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="card p-4 text-center">
          <p className="text-gray-600 text-sm mb-1">Avg Order</p>
          <p className="text-2xl font-bold">PKR {analytics.overview.avgOrderValue.toFixed(0)}</p>
        </div>

        <div className="card p-4 text-center">
          <p className="text-gray-600 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{analytics.overview.pendingOrders}</p>
        </div>

        <div className="card p-4 text-center">
          <p className="text-gray-600 text-sm mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{analytics.overview.completedOrders}</p>
        </div>

        <div className="card p-4 text-center">
          <p className="text-gray-600 text-sm mb-1">Products</p>
          <p className="text-2xl font-bold">{analytics.overview.productCount}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4">💰 Key Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Conversion Rate:</span>
              <span className="font-bold">{analytics.conversionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Total Revenue:</span>
              <span className="font-bold">PKR {analytics.overview.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Order Value:</span>
              <span className="font-bold">PKR {analytics.overview.avgOrderValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Orders:</span>
              <span className="font-bold text-yellow-600">{analytics.overview.pendingOrders}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4">📊 Order Status</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span>Completed</span>
                <span className="font-bold">
                  {analytics.overview.totalOrders > 0
                    ? ((analytics.overview.completedOrders / analytics.overview.totalOrders) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      analytics.overview.totalOrders > 0
                        ? (analytics.overview.completedOrders / analytics.overview.totalOrders) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Pending</span>
                <span className="font-bold">
                  {analytics.overview.totalOrders > 0
                    ? ((analytics.overview.pendingOrders / analytics.overview.totalOrders) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${
                      analytics.overview.totalOrders > 0
                        ? (analytics.overview.pendingOrders / analytics.overview.totalOrders) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Date Chart */}
      {revenueChartData.length > 0 && (
        <div className="card p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">📈 Revenue Trend (Last 30 Days)</h3>
          <div className="overflow-x-auto">
            <div className="min-w-full flex items-end gap-1 h-48">
              {revenueChartData.map((item, idx) => {
                const maxRevenue = Math.max(...revenueChartData.map(d => d.revenue), 1)
                const height = (item.revenue / maxRevenue) * 100

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-primary rounded-t hover:opacity-80 transition"
                      style={{ height: `${height}%`, minHeight: '10px' }}
                      title={`PKR ${item.revenue}`}
                    />
                    <span className="text-xs text-gray-600 transform -rotate-45 origin-left whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Category Statistics */}
      <div className="card p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">🏷️ Sales by Category</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Units Sold</th>
                <th className="text-left py-3 px-4">Products</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analytics.categoryStats)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([category, stats]) => (
                  <tr key={category} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{category}</td>
                    <td className="py-3 px-4">{stats.count} units</td>
                    <td className="py-3 px-4">{stats.products} products</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      {analytics.topProducts.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4">🏆 Top Performing Products</h3>
          <div className="space-y-4">
            {analytics.topProducts.map((product, idx) => (
              <div key={idx} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                <div>
                  <p className="font-bold">#{idx + 1} Product ID: {product.productId}</p>
                  <p className="text-sm text-gray-600">{product.count} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">PKR {product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
