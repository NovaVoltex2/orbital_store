export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  sku?: string
  shippingInformation?: string
  reviews?: Review[]
  meta?: {
	createdAt: string
	updatedAt: string
  }
}

export interface Review {
    rating: number
    comment: string
    date: string
    reviewerName: string
    reviewerEmail: string
}

export interface ProductResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}
