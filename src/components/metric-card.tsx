import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease" | "neutral"
  }
  icon: React.ReactNode
  className?: string
}

export function MetricCard({ title, value, change, icon, className }: MetricCardProps) {
  const getTrendIcon = () => {
    if (!change) return null
    
    switch (change.type) {
      case "increase":
        return <TrendingUp className="h-4 w-4 text-success" />
      case "decrease":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      case "neutral":
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTrendColor = () => {
    if (!change) return ""
    
    switch (change.type) {
      case "increase":
        return "text-success"
      case "decrease":
        return "text-destructive"
      case "neutral":
        return "text-muted-foreground"
    }
  }

  return (
    <Card className={cn("shadow-card transition-smooth hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {change && (
          <div className={cn("flex items-center pt-1 text-xs", getTrendColor())}>
            {getTrendIcon()}
            <span className="ml-1">
              {change.value > 0 ? '+' : ''}{change.value}% from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}