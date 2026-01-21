export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'universal_store') // Create this preset in Cloudinary

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    if (!cloudName) {
      throw new Error('Cloudinary cloud name not configured')
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (data.secure_url) {
      return data.secure_url
    } else {
      throw new Error('Failed to upload to Cloudinary')
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

export function getCloudinaryImageUrl(publicId: string, width: number = 400, height: number = 300): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    return ''
  }

  return `https://res.cloudinary.com/${cloudName}/image/fetch/w_${width},h_${height},c_fill,q_auto/${publicId}`
}
