import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Order from '@/lib/models/Order'
import Product from '@/lib/models/Product'
import dbConnect from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get orders for revenue analytics
    const orders = await Order.find({}).lean()

    // Get products count
    const productCount = await Product.countDocuments({})

    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
    const totalOrders = orders.length
    const pendingOrders = orders.filter(order => order.orderStatus === 'Pending').length
    const completedOrders = orders.filter(order => order.orderStatus === 'Delivered').length

    // Get revenue by date (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const revenueByDate: Record<string, number> = {}
    orders
      .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
      .forEach(order => {
        const date = new Date(order.createdAt).toISOString().split('T')[0]
        revenueByDate[date] = (revenueByDate[date] || 0) + order.totalPrice
      })

    // Get top products by orders
    const productStats: Record<string, { count: number; revenue: number }> = {}
    orders.forEach(order => {
      order.cartItems?.forEach((item: any) => {
        if (!productStats[item.productId]) {
          productStats[item.productId] = { count: 0, revenue: 0 }
        }
        productStats[item.productId].count += item.quantity
        productStats[item.productId].revenue += item.quantity * item.price
      })
    })

    const topProducts = Object.entries(productStats)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([productId, stats]) => ({
        productId,
        ...stats,
      }))

    // Get category breakdown
    const products = await Product.find({}).lean()
    const categoryStats: Record<string, { count: number; products: number }> = {}

    products.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = { count: 0, products: 0 }
      }
      categoryStats[product.category].products += 1
    })

    orders.forEach(order => {
      order.cartItems?.forEach((item: any) => {
        const product = products.find((p: any) => p._id.toString() === item.productId)
        if (product && categoryStats[product.category]) {
          categoryStats[product.category].count += item.quantity
        }
      })
    })

    return NextResponse.json(
      {
        success: true,
        analytics: {
          overview: {
            totalOrders,
            totalRevenue,
            pendingOrders,
            completedOrders,
            productCount,
            avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          },
          revenueByDate,
          topProducts,
          categoryStats,
          conversionRate: ((completedOrders / totalOrders) * 100).toFixed(2),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
