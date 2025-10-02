import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, GitCommit, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  type: "deployment" | "build" | "error" | "commit"
  status: "success" | "failed" | "pending" | "warning"
  title: string
  description: string
  timestamp: string
  project?: string
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "deployment",
    status: "success",
    title: "Deployment completed",
    description: "Production deployment of ecommerce-api v2.1.0",
    timestamp: "2 minutes ago",
    project: "ecommerce-api"
  },
  {
    id: "2",
    type: "build",
    status: "failed",
    title: "Build failed",
    description: "Build failed due to test failures in user module",
    timestamp: "5 minutes ago",
    project: "user-dashboard"
  },
  {
    id: "3",
    type: "commit",
    status: "success",
    title: "New commit detected",
    description: "feat: add user authentication middleware",
    timestamp: "12 minutes ago",
    project: "auth-service"
  },
  {
    id: "4",
    type: "deployment",
    status: "success",
    title: "Deployment completed",
    description: "Staging deployment of payment-gateway v1.4.2",
    timestamp: "1 hour ago",
    project: "payment-gateway"
  },
  {
    id: "5",
    type: "error",
    status: "warning",
    title: "High memory usage detected",
    description: "Memory usage exceeded 85% threshold on production server",
    timestamp: "2 hours ago",
    project: "analytics-service"
  }
]

export function ActivityLog() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "commit":
        return <GitCommit className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Success</Badge>
      case "failed":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Failed</Badge>
      case "pending":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
      case "warning":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Warning</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {mockActivities.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-start space-x-4 p-4 border-l-2 transition-smooth hover:bg-accent/50",
                activity.status === "success" && "border-l-success",
                activity.status === "failed" && "border-l-destructive",
                activity.status === "warning" && "border-l-warning",
                activity.status === "pending" && "border-l-primary",
                index !== mockActivities.length - 1 && "border-b border-border"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                    {activity.title}
                    {getTypeIcon(activity.type)}
                  </h4>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{activity.timestamp}</span>
                  {activity.project && (
                    <Badge variant="secondary" className="text-xs">
                      {activity.project}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}