import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Order from '@/lib/models/Order'
import dbConnect from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get all orders sorted by newest first
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean()

    // Calculate stats
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
      pendingOrders: orders.filter(order => order.orderStatus === 'Pending').length,
      completedOrders: orders.filter(order => order.orderStatus === 'Delivered').length,
    }

    return NextResponse.json(
      {
        success: true,
        orders,
        stats,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// Update order status
export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { orderId, orderStatus } = body

    if (!orderId || !orderStatus) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { orderStatus },
      { new: true }
    )

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order updated successfully',
        order: updatedOrder,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
