import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/lib/models/Product'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error: any) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
