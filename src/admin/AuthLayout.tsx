import { Link, Navigate, Outlet, useLocation } from "react-router";
import { LayoutDashboard, Package, LogOut, Store } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function AuthLayout() {
  const token = localStorage.getItem("token")
  const location = useLocation()

  if (!token) {
    return <Navigate to="/" />
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Products', icon: Package, href: '/admin/products' },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-primary text-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 text-secondary">
            <Store className="h-8 w-8 fill-current" />
            <span className="text-2xl font-bold tracking-tighter text-white">ORBITAL</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link 
                key={item.href} 
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-secondary text-secondary-foreground shadow-lg' 
                    : 'hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-secondary-foreground' : 'text-secondary group-hover:scale-110 transition-transform'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start text-white/70 hover:bg-destructive/10 hover:text-destructive group"
          >
            <LogOut className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
