import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, FolderTree, Star, Boxes } from 'lucide-react'
import { useDashboardStats } from '../hooks/use-dashboard-stats'

export function DashboardOverview() {
  const { data: stats, isLoading } = useDashboardStats()

  const cards = [
    { title: 'Total Products', value: stats?.total ?? 0, icon: Package, color: 'text-primary' },
    { title: 'Categories', value: '25', icon: FolderTree, color: 'text-secondary' },
    { title: 'Average Rating', value: '4.5', icon: Star, color: 'text-highlight' },
    { title: 'In Stock', value: '1,240', icon: Boxes, color: 'text-primary' },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '...' : card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 h-[300px] flex items-center justify-center border-dashed border-2">
           <p className="text-muted-foreground italic">Sales analytics coming soon...</p>
        </Card>
        <Card className="p-6 h-[300px] flex items-center justify-center border-dashed border-2">
           <p className="text-muted-foreground italic">Recent activity coming soon...</p>
        </Card>
      </div>
    </div>
  )
}
