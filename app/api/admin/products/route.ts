import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Product from '@/lib/models/Product'
import dbConnect from '@/lib/db'

// GET all products with pagination
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''

    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }
    if (category && category !== 'All') {
      filter.category = category
    }

    const total = await Product.countDocuments(filter)
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json(
      {
        success: true,
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { title, description, price, category, images, stock } = body

    if (!title || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = new Product({
      title,
      description,
      price,
      category,
      images: images || [],
      stock: stock || 0,
      rating: 0,
      reviews: 0,
    })

    await product.save()

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT update product
export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { productId, ...updateData } = body

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID required' },
        { status: 400 }
      )
    }

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product updated successfully',
        product,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE product
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID required' },
        { status: 400 }
      )
    }

    const product = await Product.findByIdAndDelete(productId)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
