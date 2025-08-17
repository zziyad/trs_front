import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  showContainer?: boolean
}

export function PageLayout({ 
  children, 
  className, 
  containerClassName,
  showContainer = true 
}: PageLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="p-4 sm:p-6 lg:p-8">
        {showContainer ? (
          <Container className={containerClassName}>
            {children}
          </Container>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
