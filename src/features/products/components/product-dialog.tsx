import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Product } from '../types'
import { useCreateProduct, useUpdateProduct } from '../hooks/use-products'

interface ProductDialogProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export function ProductDialog({ product, open, onClose }: ProductDialogProps) {
  const isEditing = !!product
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Product>>()

  useEffect(() => {
    if (product) reset(product)
    else reset({ title: '', price: 0, category: '', description: '' })
  }, [product, reset, open])

  const onSubmit = (data: Partial<Product>) => {
    if (isEditing) {
      updateMutation.mutate({ id: product.id, data }, { onSuccess: onClose })
    } else {
      createMutation.mutate(data, { onSuccess: onClose })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Create New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title', { required: 'Title is required' })} />
            {errors.title && <span className="text-xs text-destructive">{errors.title.message}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" step="0.01" {...register('price', { required: 'Price is required' })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category', { required: 'Category is required' })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
