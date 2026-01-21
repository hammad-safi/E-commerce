import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/lib/models/Order'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const phone = searchParams.get('phone')

    if (!orderId || !phone) {
      return NextResponse.json(
        { success: false, error: 'Order ID and phone number required' },
        { status: 400 }
      )
    }

    const order = await Order.findOne({
      orderId: orderId.toUpperCase(),
      customerPhone: phone.trim(),
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found. Please check your Order ID and phone number.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error: any) {
    console.error('Order search error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
