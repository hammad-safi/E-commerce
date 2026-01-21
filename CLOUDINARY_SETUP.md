# ☁️ Cloudinary Setup Guide

## Your Cloudinary Details
```
Cloud Name: dkvx8qpqf
API Key: 571428754423165
API Secret: NAlqj80WZmTwWyBj2lYjzTHjoHM
```

## ✅ Setup Complete!
Your Cloudinary credentials are already added to `.env.local`

---

## 🎯 How to Use Cloudinary for Product Images

### **Option 1: Upload via Cloudinary Dashboard** (Recommended)
1. Go to: https://cloudinary.com/console
2. Log in with your account
3. Click "Media Library"
4. Upload your product images
5. Copy the image URL from the preview
6. Use the URL in your product: `https://res.cloudinary.com/dkvx8qpqf/image/upload/v1234/product.jpg`

### **Option 2: Programmatic Upload**
```typescript
// In your admin product creation:
import { uploadToCloudinary } from '@/lib/cloudinary'

const imageUrl = await uploadToCloudinary(file)
```

### **Option 3: Direct URL Transform**
```typescript
// Transform images on-the-fly
import { getCloudinaryImageUrl } from '@/lib/cloudinary'

const thumbnailUrl = getCloudinaryImageUrl('product-id', 200, 200)
const fullSizeUrl = getCloudinaryImageUrl('product-id', 800, 800)
```

---

## 📝 Product Image URL Format

**Cloudinary URLs:**
```
https://res.cloudinary.com/dkvx8qpqf/image/upload/v1/filename.jpg
https://res.cloudinary.com/dkvx8qpqf/image/upload/w_400,h_300,c_fill/filename.jpg
```

**In Product Creation:**
```javascript
images: [
  'https://res.cloudinary.com/dkvx8qpqf/image/upload/v1/laptop-stand-1.jpg',
  'https://res.cloudinary.com/dkvx8qpqf/image/upload/v1/laptop-stand-2.jpg',
]
```

---

## 🎨 Image Transformation Examples

### Responsive Images
```
w_200,h_200,c_fill      // 200x200 thumbnail
w_400,h_300,c_fill      // 400x300 product card
w_800,h_600,c_fill      // 800x600 full size
w_1200,h_800,c_fill     // 1200x800 hero image
```

### Quality & Format
```
q_auto                   // Auto quality based on device
f_auto                   // Auto format (webp, etc)
q_80                     // 80% quality
f_webp                   // Force WebP format
```

### Complete Example
```
https://res.cloudinary.com/dkvx8qpqf/image/upload/
  w_400,
  h_300,
  c_fill,
  q_auto,
  f_auto/
  v1/product-name.jpg
```

---

## 📱 Add Product Images

### **Via Admin Dashboard:**
1. Go to: http://localhost:3000/admin/products
2. Click "+ Add New Product"
3. Fill in product details
4. In "Image URLs" field, enter Cloudinary URLs (one per line):
   ```
   https://res.cloudinary.com/dkvx8qpqf/image/upload/v1/image1.jpg
   https://res.cloudinary.com/dkvx8qpqf/image/upload/v1/image2.jpg
   ```
5. Click "Create Product"

### **Via Seed Script:**
Edit `scripts/seed.ts`:
```typescript
{
  title: 'Laptop Stand',
  description: '...',
  price: 2999,
  images: [
    'https://res.cloudinary.com/dkvx8qpqf/image/upload/v1/laptop-stand.jpg',
    'https://res.cloudinary.com/dkvx8qpqf/image/upload/v1/laptop-stand-2.jpg',
  ],
  // ...
}
```

Then run:
```bash
npm run seed
```

---

## 🖼️ Quick Upload Tips

### **Best Image Sizes:**
- Thumbnails: 200x200px
- Product Cards: 400x300px
- Detail Pages: 800x600px
- Heroes: 1200x800px

### **File Types:**
- JPG (product photos)
- PNG (logos, transparent images)
- WebP (modern, smaller files)

### **Optimization:**
1. Compress before uploading (TinyPNG.com)
2. Use WebP format when possible
3. Cloudinary auto-optimizes
4. Add `q_auto` for device-based quality

---

## 🔗 Useful Links

- **Cloudinary Console:** https://cloudinary.com/console
- **Documentation:** https://cloudinary.com/documentation
- **Transformation API:** https://cloudinary.com/documentation/image_transformation_reference
- **Image Optimization:** https://cloudinary.com/features/image_optimization

---

## ✨ Environment Variables

Already configured in `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dkvx8qpqf"
CLOUDINARY_API_KEY="571428754423165"
CLOUDINARY_API_SECRET="NAlqj80WZmTwWyBj2lYjzTHjoHM"
```

---

## 🎯 Next Steps

1. ✅ Cloudinary account connected
2. Upload images to Cloudinary Media Library
3. Create products with Cloudinary image URLs
4. View products on your store!

**Ready to go!** 🚀
