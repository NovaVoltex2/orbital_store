import { apiClient } from '@/services/api-client'
import type { Category } from '../types'

export const categoriesApi = {
  getCategories: () => 
    apiClient<Category[]>('/products/categories'),
    
  getCategoryProducts: (slug: string) =>
    apiClient<{ products: any[] }>(`/products/category/${slug}`),
}
