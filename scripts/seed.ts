import mongoose from 'mongoose'
import Product from '../lib/models/Product'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || ''

const SAMPLE_PRODUCTS = [
  {
    title: 'Professional Laptop Stand',
    description: 'Adjustable aluminum laptop stand for better ergonomics. Compatible with all laptops up to 17 inches.',
    price: 2999,
    category: 'Electronics',
    images: ['/products/laptop-stand.jpg', '/products/laptop-stand-2.jpg'],
    stock: 50,
    rating: 4.5,
    reviews: 127,
  },
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life. Perfect for music and calls.',
    price: 4999,
    category: 'Electronics',
    images: [
      'https://via.placeholder.com/400x300?text=Headphones',
      'https://via.placeholder.com/400x300?text=Headphones+2',
    ],
    stock: 75,
    rating: 4.7,
    reviews: 256,
  },
  {
    title: 'Designer T-Shirt Collection',
    description: '100% cotton premium t-shirt with unique designs. Available in multiple sizes and colors.',
    price: 1499,
    category: 'Clothing',
    images: ['https://via.placeholder.com/400x300?text=T-Shirt'],
    stock: 200,
    rating: 4.3,
    reviews: 89,
  },
  {
    title: 'Complete Python Course (PDF)',
    description: 'Comprehensive guide to learning Python programming. Includes 500+ pages of content and exercises.',
    price: 999,
    category: 'Digital Products',
    images: ['https://via.placeholder.com/400x300?text=Python+Course'],
    stock: 999,
    rating: 4.9,
    reviews: 542,
  },
  {
    title: 'Indoor Plant Pot Set',
    description: 'Set of 3 ceramic plant pots with drainage holes. Perfect for indoor gardening.',
    price: 1999,
    category: 'Home & Garden',
    images: ['https://via.placeholder.com/400x300?text=Plant+Pots'],
    stock: 45,
    rating: 4.4,
    reviews: 178,
  },
  {
    title: 'Professional Photography eBook',
    description: '200+ pages guide to mastering photography. Learn composition, lighting, and editing.',
    price: 1299,
    category: 'Digital Products',
    images: ['https://via.placeholder.com/400x300?text=Photography+eBook'],
    stock: 999,
    rating: 4.8,
    reviews: 412,
  },
  {
    title: 'Yoga Mat with Carrying Strap',
    description: 'Non-slip yoga mat made from eco-friendly TPE material. 6mm thickness for comfort.',
    price: 2499,
    category: 'Sports',
    images: ['https://via.placeholder.com/400x300?text=Yoga+Mat'],
    stock: 60,
    rating: 4.6,
    reviews: 203,
  },
  {
    title: 'Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, and Node.js. Complete bootcamp guide with projects.',
    price: 1999,
    category: 'Digital Products',
    images: ['https://via.placeholder.com/400x300?text=Web+Dev+Course'],
    stock: 999,
    rating: 4.9,
    reviews: 678,
  },
  {
    title: 'Premium Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe. 12-cup capacity with auto-brew timer.',
    price: 3999,
    category: 'Home & Garden',
    images: ['https://via.placeholder.com/400x300?text=Coffee+Maker'],
    stock: 30,
    rating: 4.5,
    reviews: 145,
  },
  {
    title: 'Best-Seller Novel Bundle',
    description: 'Collection of 5 international best-seller novels in one bundle. Great for reading enthusiasts.',
    price: 2499,
    category: 'Books',
    images: ['https://via.placeholder.com/400x300?text=Book+Bundle'],
    stock: 100,
    rating: 4.7,
    reviews: 289,
  },
  {
    title: 'Smartphone Screen Protector',
    description: 'Tempered glass screen protector for all smartphone models. Anti-fingerprint coating.',
    price: 599,
    category: 'Electronics',
    images: ['https://via.placeholder.com/400x300?text=Screen+Protector'],
    stock: 500,
    rating: 4.2,
    reviews: 567,
  },
  {
    title: 'Marketing Strategy Guide',
    description: '300+ page guide on digital marketing, SEO, and social media strategy. PDF + templates included.',
    price: 1599,
    category: 'Digital Products',
    images: ['https://via.placeholder.com/400x300?text=Marketing+Guide'],
    stock: 999,
    rating: 4.8,
    reviews: 421,
  },
]

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || MONGODB_URI
    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables')
    }
    await mongoose.connect(uri)
    console.log('✅ Connected to MongoDB')

    // Clear existing products
    await Product.deleteMany({})
    console.log('🗑️  Cleared existing products')

    // Insert sample products
    const result = await Product.insertMany(SAMPLE_PRODUCTS)
    console.log(`✨ Successfully added ${result.length} sample products!`)

    console.log('\n📦 Products added:')
    result.forEach((product) => {
      console.log(`  - ${product.title} (${product.category}) - PKR ${product.price}`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()
