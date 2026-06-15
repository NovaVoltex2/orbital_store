import { LayoutDashboard, LayoutGrid, Package, User2 } from "lucide-react";

export const navItems = [
	{ label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
	{ label: 'Products', icon: Package, href: '/admin/products' },
	{ label: 'Categories', icon: LayoutGrid, href: '/admin/categories' },
	{ label: 'Profile', icon: User2, href: '/admin/profile' },
]