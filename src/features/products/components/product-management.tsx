import { useState } from 'react'
import { Link } from 'react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Edit2, Eye, MoreHorizontal, Plus, Star, Grid, List, Search, 
  ChevronLeft, ChevronRight, FileSpreadsheet, FileText, Trash2 
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { useProducts } from '../hooks/use-products'
import { useDebounce } from '@/hooks/use-debounce'
import { exportToExcel, exportToPDF } from '@/utils/export-utils'
import { ProductDialog } from './product-dialog'
import { ProductDeleteDialog } from './product-delete-dialog'
import type { Product } from '../types'

export function ProductManagement() {
  // State for filtering/pagination
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState('10')
  const [sortBy, setSortBy] = useState('title')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // UI state
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const limit = parseInt(itemsPerPage)
  const skip = (currentPage - 1) * limit

  const { data, isLoading } = useProducts({
    limit,
    skip,
    q: debouncedSearch,
    sortBy,
    order
  })

  const totalPages = data ? Math.ceil(data.total / limit) : 0

  const handleExportExcel = () => {
    if (!data?.products) return
    const exportData = data.products.map(p => ({
      ID: p.id,
      Name: p.title,
      Price: p.price,
      Category: p.category,
      Stock: p.stock,
      Brand: p.brand
    }))
    exportToExcel(exportData, `products_export_${Date.now()}`)
  }

  const handleExportPDF = () => {
     if (!data?.products) return
     const exportData = data.products.map(p => ({
       ID: p.id,
       Name: p.title,
       Price: `$${p.price}`,
       Category: p.category,
       Stock: p.stock
     }))
     exportToPDF(exportData, "Product Catalog Report", `products_report_${Date.now()}`)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setFormOpen(true)
  }

  const handleDelete = (product: Product) => {
    setSelectedProduct(product)
    setDeleteOpen(true)
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Product Inventory</h1>
          <p className="text-muted-foreground">Manage your store catalog with advanced tools.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportExcel} className="hidden sm:flex">
                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" /> Excel
            </Button>
            <Button variant="outline" onClick={handleExportPDF} className="hidden sm:flex">
                <FileText className="mr-2 h-4 w-4 text-red-600" /> PDF
            </Button>
            <Button 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold"
                onClick={() => { setSelectedProduct(null); setFormOpen(true); }}
            >
                <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search name or category..." 
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="pl-10"
                />
           </div>
           
           <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={order} onValueChange={(v) => setOrder(v as 'asc' | 'desc')}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex border rounded-lg overflow-hidden shrink-0">
                    <Button 
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                        size="icon" 
                        onClick={() => setViewMode('table')}
                        className="rounded-none h-10 w-10"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                        size="icon" 
                        onClick={() => setViewMode('grid')}
                        className="rounded-none h-10 w-10"
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                </div>
           </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingSkeleton viewMode={viewMode} />
      ) : data?.products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
             <Search className="h-12 w-12 text-muted-foreground mb-4" />
             <h3 className="text-xl font-semibold">No products found</h3>
             <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
            <Table>
            <TableHeader className="bg-muted/50">
                <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/30">
                    <TableCell>
                    <img 
                        src={product.thumbnail} 
                        alt={product.title} 
                        className="w-10 h-10 rounded shadow-sm object-cover" 
                    />
                    </TableCell>
                    <TableCell className="font-medium text-primary">{product.title}</TableCell>
                    <TableCell>
                    <Badge variant="outline" className="capitalize border-primary/20 text-primary/80">
                        {product.category}
                    </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">${product.price}</TableCell>
                    <TableCell>
                    <span className={product.stock < 10 ? 'text-destructive font-bold' : ''}>
                        {product.stock}
                    </span>
                    </TableCell>
                    <TableCell>
                    <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-highlight text-highlight" />
                        <span>{product.rating}</span>
                    </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <ActionsMenu 
                            onView={`/admin/product/${product.id}`}
                            onEdit={() => handleEdit(product)}
                            onDelete={() => handleDelete(product)}
                        />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.products.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square overflow-hidden relative">
                        <img 
                            src={product.thumbnail} 
                            alt={product.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2">
                             <Badge className="bg-primary/80 backdrop-blur-sm text-white">${product.price}</Badge>
                        </div>
                    </div>
                    <CardHeader className="p-4 space-y-1">
                        <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{product.category}</p>
                    </CardHeader>
                    <CardContent className="px-4 pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{product.description}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm font-semibold">
                             <Star className="h-4 w-4 fill-highlight text-highlight" />
                             {product.rating}
                        </div>
                        <div className="flex gap-1">
                             <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <Link to={`/admin/product/${product.id}`}><Eye className="h-4 w-4" /></Link>
                             </Button>
                             <Button 
                                variant="ghost" size="icon" className="h-8 w-8"
                                onClick={() => handleEdit(product)}
                             >
                                <Edit2 className="h-4 w-4" />
                             </Button>
                             <Button 
                                variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(product)}
                             >
                                <Trash2 className="h-4 w-4" />
                             </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && data && data.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6 pb-2">
            <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{skip + 1}</span> to <span className="font-medium">{Math.min(skip + limit, data.total)}</span> of <span className="font-medium">{data.total}</span> products
                </p>
                <Select value={itemsPerPage} onValueChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-[100px]">
                        <SelectValue placeholder="Show" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10 / Page</SelectItem>
                        <SelectItem value="20">20 / Page</SelectItem>
                        <SelectItem value="50">50 / Page</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="flex items-center gap-1">
                <Button 
                    variant="outline" size="icon" className="h-8 w-8"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {/* Generate page numbers */}
                <div className="hidden sm:flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                            pageNum = currentPage - 2 + i;
                        }
                        if (pageNum > totalPages) return null;
                        
                        return (
                            <Button 
                                key={pageNum}
                                variant={currentPage === pageNum ? 'secondary' : 'ghost'}
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setCurrentPage(pageNum)}
                            >
                                {pageNum}
                            </Button>
                        )
                    })}
                </div>

                <Button 
                    variant="outline" size="icon" className="h-8 w-8"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      )}

      {/* Dialogs */}
      <ProductDialog 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        product={selectedProduct} 
      />
      <ProductDeleteDialog 
        open={deleteOpen} 
        onClose={() => setDeleteOpen(false)} 
        id={selectedProduct?.id || null} 
      />
    </div>
  )
}

function ActionsMenu({ onView, onEdit, onDelete }: { onView: string, onEdit: () => void, onDelete: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link to={onView} className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function LoadingSkeleton({ viewMode }: { viewMode: 'table' | 'grid' }) {
    if (viewMode === 'table') {
        return (
            <div className="border rounded-lg overflow-hidden space-y-1">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex p-4 gap-4 items-center bg-white border-b">
                        <Skeleton className="h-10 w-10 rounded" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                    </div>
                ))}
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </Card>
            ))}
        </div>
    )
}
