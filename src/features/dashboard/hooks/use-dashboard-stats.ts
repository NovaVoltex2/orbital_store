import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/api-client'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await apiClient<{ total: number }>('/products?limit=1')
      return res
    },
  })
}
