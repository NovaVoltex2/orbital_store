import { useMutation, useQuery } from '@tanstack/react-query'
import { productsApi, type GetProductsParams,  } from '@/features/products/api/products.api'
import { queryClient } from '@/services/query-client'
import { toast } from 'sonner'
import type { Product } from '@/features/products/types'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: GetProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...productKeys.details(), id] as const,
}

export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.getProducts(params),
    placeholderData: (previousData) => previousData, // Maintain data while fetching new params
  })
}

export function useProduct(id: string | number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success("Product created successfully")
    },
    onError: (error: Error) => {
      toast.error("Operation failed", { description: error.message })
    }
  })
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) => 
      productsApi.updateProduct(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) })
      toast.success("Product updated successfully")
    },
    onError: (error: Error) => {
      toast.error("Update failed", { description: error.message })
    }
  })
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success("Product deleted successfully")
    },
    onError: (error: Error) => {
      toast.error("Deletion failed", { description: error.message })
    }
  })
}
