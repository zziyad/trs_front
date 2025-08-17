import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function PageHeader({ 
  title, 
  description, 
  actions, 
  className,
  titleClassName,
  descriptionClassName
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="space-y-1">
        <h1 className={cn("text-3xl font-bold tracking-tight", titleClassName)}>
          {title}
        </h1>
        {description && (
          <p className={cn("text-muted-foreground", descriptionClassName)}>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}
