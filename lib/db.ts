import mongoose from 'mongoose'

const mongodbUri = process.env.MONGODB_URI as string

if (!mongodbUri) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = global as any

if (!cached.mongoose) {
  cached.mongoose = {
    conn: null,
    promise: null,
  }
}

async function connectDB() {
  if (cached.mongoose.conn) {
    return cached.mongoose.conn
  }

  if (!cached.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.mongoose.promise = mongoose
      .connect(mongodbUri, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB Connected')
        return mongoose
      })
      .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err)
        throw err
      })
  }

  try {
    cached.mongoose.conn = await cached.mongoose.promise
  } catch (e) {
    cached.mongoose.promise = null
    throw e
  }

  return cached.mongoose.conn
}

export default connectDB
