import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      // @ts-expect-error - React Query v5 types for meta are still evolving
      onError: (error: Error) => {
        toast.error("Data Fetching Error", {
          description: error.message
        })
      }
    },
    mutations: {
      retry: 0,
    },
  },
})
