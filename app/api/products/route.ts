import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/lib/models/Product'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    let query: any = {}

    if (category && category !== 'all') {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (page - 1) * limit
    const products = await Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })
    const total = await Product.countDocuments(query)

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
