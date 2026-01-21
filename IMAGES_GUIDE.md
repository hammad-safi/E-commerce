# 📸 How to Add Product Images

## Three Ways to Add Images

### **Option 1: Use Local Images (Best for Development)**

1. **Create an `images` folder in `public`:**
   ```
   public/
   ├── products/
   │   ├── laptop-stand.jpg
   │   ├── headphones.jpg
   │   ├── coffee-maker.jpg
   │   └── ...
   └── manifest.json
   ```

2. **Add your image files to `/public/products/` folder**

3. **Update product in database:**
   ```javascript
   // In seed.ts or when creating products
   images: [
     '/products/laptop-stand.jpg',
     '/products/laptop-stand-2.jpg',
   ]
   ```

---

### **Option 2: Use Cloudinary (Cloud Storage - FREE)**

Cloudinary gives you **25GB free storage** for images!

#### **Setup Steps:**

1. **Sign up for Cloudinary:**
   - Visit: https://cloudinary.com/users/register/free
   - Create free account

2. **Upload images:**
   - Go to Media Library in dashboard
   - Upload your product images
   - Copy the URL of each image

3. **Get your Cloud URL:**
   - Each image has a URL like: `https://res.cloudinary.com/your-cloud-name/image/upload/v1234/product.jpg`

4. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_CLOUDINARY_NAME=your-cloud-name
   ```

5. **Add images to products:**
   ```javascript
   images: [
     'https://res.cloudinary.com/your-cloud-name/image/upload/v1234/laptop-stand.jpg',
     'https://res.cloudinary.com/your-cloud-name/image/upload/v1234/laptop-stand-2.jpg',
   ]
   ```

---

### **Option 3: Use External URLs (e.g., Unsplash, Pexels)**

Use free stock photo services:

- **Unsplash:** https://unsplash.com (CC0 license)
- **Pexels:** https://pexels.com (free stock photos)
- **Pixabay:** https://pixabay.com (free images)

**Example:**
```javascript
images: [
  'https://images.unsplash.com/photo-laptop?w=400',
  'https://images.pexels.com/coffee-maker-image',
]
```

---

## **Quick Start: Add Local Images**

### **Step 1: Create folders**
```powershell
# In PowerShell
mkdir C:\Users\Hammad\OneDrive\Desktop\e-commerce\public\products
```

### **Step 2: Add image files**
- Download or create product images
- Place them in `/public/products/` folder
- Supported formats: `.jpg`, `.png`, `.webp`, `.gif`

### **Step 3: Update product images**

Edit [scripts/seed.ts](scripts/seed.ts):

```typescript
{
  title: 'Wireless Bluetooth Headphones',
  description: '...',
  price: 4999,
  category: 'Electronics',
  images: [
    '/products/headphones-1.jpg',
    '/products/headphones-2.jpg',
  ],
  // ... rest of product
}
```

### **Step 4: Re-seed database**
```powershell
npm run seed
```

### **Step 5: Restart server**
```powershell
npm run dev
```

---

## **Image Best Practices**

✅ **Do's:**
- Use **high-quality images** (min 400x400px recommended)
- Use **multiple angles** for products
- Keep file size **under 500KB** per image (compress using TinyPNG)
- Use consistent **aspect ratio** (square 1:1 or 4:3)

❌ **Don'ts:**
- Don't use broken URLs
- Don't use images without permission
- Don't use images >2MB (will slow down site)
- Don't mix different image styles/qualities

---

## **Image URLs Format**

```
Local paths:      /products/my-image.jpg
Cloudinary:       https://res.cloudinary.com/{cloud}/image/upload/v{version}/file.jpg
Unsplash:         https://images.unsplash.com/photo-xxxxx?w=400
Direct URLs:      https://example.com/image.jpg
```

---

## **Troubleshooting**

### **Images not showing?**
1. Check file path in database
2. Make sure file exists in `/public/products/`
3. Restart dev server: `npm run dev`
4. Clear browser cache (Ctrl+Shift+Delete)

### **Images loading slow?**
1. **Compress images** using TinyPNG.com
2. **Use WebP format** for faster loading
3. **Reduce image size** to max 500KB

### **Getting errors with placeholder images?**
- We disabled external placeholder service
- Use local images or Cloudinary instead
- Update next.config.js if needed

---

## **Current Setup**

✅ **Enabled:** Local images from `/public/products/`  
✅ **Enabled:** Cloudinary remote images  
✅ **Disabled:** via.placeholder.com (external service - was causing errors)

Your store is ready to display product images! 🖼️
