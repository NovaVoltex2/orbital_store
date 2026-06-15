import { useParams, useNavigate } from 'react-router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, ShoppingCart, Tag, Package, Truck } from 'lucide-react'
import { useProduct } from '../hooks/use-products'
import { useState } from 'react'

export function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(id!)
  const [activeImage,setActiveImage] = useState<string>(product?.thumbnail || "")

  if (isLoading) return <div className="p-8">Loading details...</div>
  if (!product) return <div className="p-8">Product not found.</div>

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
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              {product.brand && (
                <Badge className="bg-secondary text-secondary-foreground font-semibold">
                  {product.brand}
                </Badge>
              )}
            </div>
            <div className='flex justify-between items-center mt-2'>
              <CardTitle className="text-4xl font-bold text-primary">
                {product.title}
              </CardTitle>
              <div className="flex items-center gap-1  font-bold">
                <Star className="h-4 w-4 fill-current text-highlight" />
                {product.rating}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center">
              <img
                src={activeImage || product.thumbnail}
                alt={product.title}
                className="max-h-full object-contain"
              />
            </div>
            <div className="flex overflow-x-scroll scroll-auto gap-2 p-2">
              {product.images.slice(0).map((img: string, i: number) => (
                <div
                  key={i}
                  className={`aspect-square w-25 rounded-xl overflow-hidden bg-muted flex items-center justify-center cursor-pointer ${img === activeImage ? "ring-2 ring-primary" : "ring-1 ring-transparent"} transition-all`}
                  onClick={() => {
                    setActiveImage(img);
                    console.log("act:", img);
                  }}
                >
                  <img
                    src={img}
                    alt={product.title}
                    className="max-h-full object-contain"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem
                icon={ShoppingCart}
                label="Stock"
                value={product.stock}
              />
              <InfoItem icon={Tag} label="Category" value={product.category} />
              <InfoItem
                icon={Package}
                label="SKU"
                value={product.sku || "N/A"}
              />
              <InfoItem
                icon={Truck}
                label="Shipping"
                value={product.shippingInformation || "Standard"}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-2 border-primary/5 bg-primary/2">
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Retail Price
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    ${product.price}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-lg text-destructive line-through">
                      $
                      {(
                        product.price *
                        (1 + product.discountPercentage / 100)
                      ).toFixed(2)}
                    </span>
                  )}
                </div>
                {product.discountPercentage > 0 && (
                  <Badge variant="destructive" className="mt-2">
                    SAVE {product.discountPercentage}%
                  </Badge>
                )}
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
              <CardTitle className="text-sm font-medium">
                Customer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.reviews?.map((review: any, i: number) => (
                <div key={i} className="text-sm border-b pb-2 last:border-0">
                  <div className="flex justify-between font-medium">
                    <span>{review.reviewerName}</span>
                    <span className="text-highlight">★ {review.rating}</span>
                  </div>
                  <p className="text-muted-foreground mt-1 line-clamp-2">
                    {review.comment}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
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
