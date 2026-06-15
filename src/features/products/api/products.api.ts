import { apiClient } from '@/services/api-client'
import type { Product, ProductResponse } from '@/features/products/types'

export interface GetProductsParams {
  limit?: number
  skip?: number
  q?: string
  sortBy?: string
  order?: 'asc' | 'desc'
}

export const productsApi = {
  getProducts: (params: GetProductsParams = {}) => {
    const { q, ...rest } = params
    const endpoint = q ? '/products/search' : '/products'
    return apiClient<ProductResponse>(endpoint, { 
      params: { 
        ...rest,
        ...(q && { q })
      } 
    })
  },
  
  getProduct: (id: string | number) => 
    apiClient<Product>(`/products/${id}`),
    
  createProduct: (data: Partial<Product>) =>
    apiClient<Product>('/products/add', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

  updateProduct: (id: number, data: Partial<Product>) =>
    apiClient<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

  deleteProduct: (id: number) =>
    apiClient<{ isDeleted: boolean }>(`/products/${id}`, {
        method: 'DELETE'
    })
}
