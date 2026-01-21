import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  title: string
  description: string
  price: number
  category: string
  images: string[]
  stock: number
  rating: number
  reviews: number
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a product title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Electronics', 'Clothing', 'Books', 'Digital Products', 'Home & Garden', 'Sports', 'Other'],
    },
    images: [
      {
        type: String,
        default: 'https://via.placeholder.com/400x400',
      },
    ],
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)
