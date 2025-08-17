import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsItem {
  title: string
  value: number | string
  description: string
  icon: LucideIcon
}

interface StatsGridProps {
  items: StatsItem[]
  gridCols?: '2' | '3' | '4' | '5'
  className?: string
}

export function StatsGrid({ items, gridCols = '4', className }: StatsGridProps) {
  const gridColsClass = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    '5': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  }

  return (
    <div className={cn("grid gap-4", gridColsClass[gridCols], className)}>
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
