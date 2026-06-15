import { Link, Navigate, Outlet, useLocation } from "react-router";
import { LogOut, Store, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navItems } from "@/constants/navItems";

export default function AuthLayout() {
  const token = localStorage.getItem("token")
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!token) {
    return <Navigate to="/" />
  }



  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const SidebarContent = ({ className }: { className?: string }) => (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-6">
        <div className="flex items-center gap-3 text-secondary">
          <Store className="h-8 w-8 fill-current text-white/90" />
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
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? 'bg-secondary text-secondary-foreground shadow-lg' 
                  : 'hover:bg-white/10 text-white/70 hover:text-white'
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? 'text-secondary-foreground' : 'text-secondary group-hover:scale-110 transition-transform')} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-white/70 hover:bg-destructive/10 hover:text-destructive group p-3"
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar (Permanent on Laptop/Desktop) */}
      <aside className="hidden lg:flex w-72 border-r bg-primary text-white flex-col shrink-0">
        <SidebarContent />
      </aside>

      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
        {/* Top Header - Mobile/Tablet only */}
        <header className="lg:hidden h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-40">
           <div className="flex items-center gap-2">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72 bg-primary border-none">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Navigation Menu</SheetTitle>
                        </SheetHeader>
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
                <div className="flex items-center gap-2 text-primary font-bold">
                    <Store className="h-6 w-6 fill-primary" />
                    <span className="tracking-tighter">ORBITAL</span>
                </div>
           </div>
           
           <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground">
                    <LogOut className="h-5 w-5" />
                </Button>
           </div>
        </header>

        {/* Main Content Area */}
        <main className={cn(
            "flex-1 overflow-y-auto bg-muted/10 pb-24 lg:pb-8",
        )}>
          <div className="max-w-7xl mx-auto w-full p-4 md:p-8">
            <Outlet />
          </div>
        </main>

        {/* Bottom Navigation (Mobile Only) */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-t flex lg:hidden items-center justify-around px-2 z-50">
            {navItems.map((item) => {
                const isActive = location.pathname === item.href
                return (
                    <Link 
                        key={item.href}
                        to={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all duration-300",
                            isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
                        )}
                    >
                        <div className={cn(
                            "p-1.5 rounded-full mb-0.5",
                            isActive && "bg-primary/10"
                        )}>
                            <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                    </Link>
                )
            })}
            <button 
                onClick={handleLogout}
                className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-destructive transition-colors"
            >
                <div className="p-1.5 rounded-full mb-0.5">
                    <LogOut className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Quit</span>
            </button>
        </nav>
      </div>
    </div>
  )
}
