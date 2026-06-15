import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Building, Calendar, ShieldCheck, MailWarning } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/features/auth/api/auth.api'

export function UserProfile() {
  const userJson = localStorage.getItem("user")
  const localUser = userJson ? JSON.parse(userJson) : null
  
  // We can also fetch the latest data from /auth/me if we have a token
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getCurrentUser,
    placeholderData: localUser
  })

  if (isLoading && !localUser) {
    return <div className="p-8 text-center">Loading profile...</div>
  }

  const currentUser = user || localUser

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Side: Avatar and Basic Info */}
        <Card className="w-full md:w-80 shrink-0 border-none bg-primary text-white shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <ShieldCheck className="h-24 w-24" />
          </div>
          <CardHeader className="items-center text-center pb-8 pt-10">
            <div className="relative mb-4">
                 <div className="size-32 rounded-full border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    {currentUser?.image ? (
                        <img src={currentUser.image} alt={currentUser.username} className="size-full object-cover" />
                    ) : (
                        <User className="size-16 text-white/50" />
                    )}
                 </div>
                 <div className="absolute -bottom-1 -right-1 size-8 bg-secondary rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="size-3 bg-green-400 rounded-full animate-pulse" />
                 </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">{currentUser?.firstName} {currentUser?.lastName}</CardTitle>
            <p className="text-white/60 font-medium tracking-widest text-xs uppercase mt-1">@{currentUser?.username}</p>
            <Badge variant="secondary" className="mt-4 bg-white/10 hover:bg-white/20 text-white border-transparent">
                System Administrator
            </Badge>
          </CardHeader>
          <CardContent className="bg-white/5 backdrop-blur-md p-6 space-y-4">
             <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-secondary" />
                <span className="truncate">{currentUser?.email}</span>
             </div>
             <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>San Francisco, CA</span>
             </div>
             <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-secondary" />
                <span>Joined Oct 2023</span>
             </div>
          </CardContent>
        </Card>

        {/* Right Side: Details and Form */}
        <div className="flex-1 space-y-6 w-full">
            <Card className="shadow-lg border-none">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Account Details</CardTitle>
                    <CardDescription>Manage your personal information and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue={currentUser?.firstName} readOnly className="bg-muted/30" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue={currentUser?.lastName} readOnly className="bg-muted/30" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="email" defaultValue={currentUser?.email} readOnly className="pl-10 bg-muted/30" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="phone" defaultValue="+1 (555) 000-0000" readOnly className="pl-10 bg-muted/30" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Department</Label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="company" defaultValue="Core Operations" readOnly className="pl-10 bg-muted/30" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="outline">Reset Password</Button>
                        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-8">
                            Update Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <MailWarning className="h-5 w-5" />
                        <CardTitle className="text-lg">Security & Access</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Manage your security settings and session devices. Last login was 2 hours ago from San Francisco, US.
                    </p>
                    <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive p-0">
                        View active sessions
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
