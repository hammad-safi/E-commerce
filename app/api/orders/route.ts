import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/lib/models/Order'
import Product from '@/lib/models/Product'
import { generateOrderId } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()

    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      cartItems,
      totalPrice,
      paymentMethod,
    } = body

    // Validate required fields
    if (
      !customerName ||
      !customerPhone ||
      !customerAddress ||
      !customerCity ||
      !cartItems ||
      cartItems.length === 0 ||
      !totalPrice
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const orderId = generateOrderId()

    const order = new Order({
      orderId,
      customerName,
      customerEmail: customerEmail || 'not-provided@store.com',
      customerPhone,
      customerAddress,
      customerCity,
      cartItems,
      totalPrice,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Processing',
      orderStatus: 'Pending',
    })

    // Reduce stock and increment reviews for each product in the order
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { 
          $inc: { 
            stock: -item.quantity,
            reviews: 1  // Increment review count by 1 for each purchase
          } 
        },
        { new: true }
      )
    }

    await order.save()

    return NextResponse.json(
      {
        success: true,
        message: 'Order placed successfully',
        orderId,
        order,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
