import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '@/features/auth/api/auth.api'
import { queryClient } from '@/services/query-client'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

export function useLogin() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      queryClient.setQueryData(['current-user'], data)
      toast.success(`Welcome back, ${data.firstName}!`, {
        description: "You have successfully logged in."
      })
      navigate('/admin')
    },
    onError: (error: Error) => {
      toast.error("Login Failed", {
        description: error.message || "Please check your credentials and try again."
      })
    }
  })
}

export function useUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: authApi.getCurrentUser,
    enabled: !!localStorage.getItem('token'),
  })
}

export function useLogout() {
  const navigate = useNavigate()

  return () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    queryClient.clear()
    toast.info("Logged out successfully")
    navigate('/')
  }
}
