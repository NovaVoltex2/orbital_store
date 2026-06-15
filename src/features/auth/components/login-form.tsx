import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useLogin } from '../hooks/use-auth'

export function LoginForm() {
  const [username, setUsername] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')
  const loginMutation = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ username, password })
  }

  return (
    <Card className="w-[400px] shadow-lg border-primary/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold tracking-tight text-primary">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the admin portal
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="emilys"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="focus-visible:ring-secondary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus-visible:ring-secondary"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging in...' : 'Sign in'}
          </Button>
          {loginMutation.isError && (
            <p className="text-sm text-destructive text-center">
              Login failed. Please check your credentials.
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
