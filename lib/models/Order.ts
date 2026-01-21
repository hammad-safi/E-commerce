import mongoose, { Schema, Document } from 'mongoose'

export interface ICartItem {
  productId: string
  title: string
  price: number
  quantity: number
  image: string
}

export interface IOrder extends Document {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  cartItems: ICartItem[]
  totalPrice: number
  paymentMethod: 'COD' | 'Stripe'
  paymentStatus: 'Pending' | 'Completed' | 'Failed'
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    customerEmail: {
      type: String,
      lowercase: true,
      sparse: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    customerAddress: {
      type: String,
      required: [true, 'Please provide address'],
    },
    customerCity: {
      type: String,
      required: [true, 'Please provide city'],
    },
    cartItems: [
      {
        productId: String,
        title: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Stripe'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    notes: String,
  },
  { timestamps: true }
)

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)
