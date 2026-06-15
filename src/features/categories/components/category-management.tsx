import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, FolderOpen, ArrowRight, Grid, List } from 'lucide-react'
import { useCategories } from '../hooks/use-categories'
import { cn } from '@/lib/utils'

export function CategoryManagement() {
  const { data: categories, isLoading } = useCategories()
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredCategories = categories?.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Categories</h1>
          <p className="text-muted-foreground">Browse and manage product groupings.</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
           <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search categories..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-full"
                />
           </div>
           
           <div className="flex items-center border rounded-lg overflow-hidden shrink-0">
                <Button 
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    onClick={() => setViewMode('list')}
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
        </CardContent>
      </Card>

      {isLoading ? (
        <LoadingSkeleton viewMode={viewMode} />
      ) : filteredCategories?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
             <Search className="h-12 w-12 text-muted-foreground mb-4" />
             <h3 className="text-xl font-semibold">No categories match your search</h3>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories?.map((category) => (
            <Card key={category.slug} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-primary/10 hover:border-l-primary">
              <CardHeader className="p-5 flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{category.slug}</p>
                  <CardTitle className="text-xl capitalize">{category.name}</CardTitle>
                </div>
                <div className="p-2 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <FolderOpen className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0">
                <Button variant="ghost" size="sm" className="w-full justify-between mt-2 group/btn">
                  View Products
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
            <div className="divide-y">
                {filteredCategories?.map((category) => (
                    <div key={category.slug} className="flex flex-row items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-primary/5 text-primary">
                                <FolderOpen className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg capitalize">{category.name}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">{category.slug}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </Card>
      )}
    </div>
  )
}

function LoadingSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
    if (viewMode === 'list') {
        return (
            <Card className="divide-y">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="p-6 flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-3 w-1/6" />
                        </div>
                    </div>
                ))}
            </Card>
        )
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-9 w-full mt-2" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
