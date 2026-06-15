import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, ShoppingCart, Tag } from 'lucide-react'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`https://dummyjson.com/products/${id}`)
      return res.json()
    }
  })

  if (isLoading) return <div className="p-8">Loading details...</div>

  return (
    <div className="p-8 space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge className="bg-secondary text-secondary-foreground font-semibold">
                {product.brand}
              </Badge>
              <div className="flex items-center gap-1 text-highlight font-bold">
                <Star className="h-4 w-4 fill-current" />
                {product.rating}
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-primary mt-2">{product.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center">
              <img 
                src={product.images[0]} 
                alt={product.title} 
                className="max-h-full object-contain" 
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <InfoItem icon={ShoppingCart} label="Stock" value={product.stock} />
               <InfoItem icon={Tag} label="Category" value={product.category} />
               <InfoItem icon={Package} label="SKU" value={product.sku} />
               <InfoItem icon={Truck} label="Shipping" value={product.shippingInformation} />
            </div>
          </CardContent>
        </Card>

        {/* Sidebar / Pricing */}
        <div className="space-y-6">
          <Card className="border-2 border-primary/5 bg-primary/2">
            <CardContent className="p-6 space-y-6">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Retail Price</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary">${product.price}</span>
                        <span className="text-lg text-destructive line-through">
                             ${(product.price * (1 + product.discountPercentage/100)).toFixed(2)}
                        </span>
                    </div>
                    <Badge variant="destructive" className="mt-2">
                        SAVE {product.discountPercentage}%
                    </Badge>
                </div>

                <div className="space-y-2">
                    <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-lg font-bold">
                        Update Pricing
                    </Button>
                    <Button variant="outline" className="w-full py-6">
                        Manage Inventory
                    </Button>
                </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle className="text-sm font-medium">Customer Reviews</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                {product.reviews.map((review: any, i: number) => (
                    <div key={i} className="text-sm border-b pb-2 last:border-0">
                        <div className="flex justify-between font-medium">
                            <span>{review.reviewerName}</span>
                            <span className="text-highlight">★ {review.rating}</span>
                        </div>
                        <p className="text-muted-foreground mt-1 line-clamp-2">{review.comment}</p>
                    </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <div className="p-3 bg-muted/50 rounded-lg space-y-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase">{label}</span>
      </div>
      <p className="text-sm font-bold text-primary truncate">{value}</p>
    </div>
  )
}

function Package({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
}

function Truck({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="13" x="2" y="6" rx="2"/><path d="M18 9h2l3 3v7h-5"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></svg>
}