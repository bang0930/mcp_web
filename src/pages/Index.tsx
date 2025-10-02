import { MetricCard } from "@/components/metric-card"
import { ActivityLog } from "@/components/activity-log"
import { ResourceChart } from "@/components/resource-chart"
import { 
  Server, 
  Zap, 
  Activity, 
  Users,
  Plus,
  ExternalLink,
  RefreshCw 
} from "lucide-react"
import { Button } from "@/components/ui/button"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Welcome to <span className="gradient-primary bg-clip-text text-transparent">Aolda Cloud</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional CI/CD deployment management for modern development teams. 
              Monitor, deploy, and scale your applications with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="shadow-glow">
                <Plus className="mr-2 h-5 w-5" />
                Create New Project
              </Button>
              <Button variant="outline" size="lg">
                <ExternalLink className="mr-2 h-5 w-5" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Metrics Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Projects"
              value={12}
              change={{ value: 20, type: "increase" }}
              icon={<Server className="h-4 w-4" />}
            />
            <MetricCard
              title="Deployments (24h)"
              value={47}
              change={{ value: 12, type: "increase" }}
              icon={<Zap className="h-4 w-4" />}
            />
            <MetricCard
              title="Active VMs"
              value={8}
              change={{ value: 0, type: "neutral" }}
              icon={<Activity className="h-4 w-4" />}
            />
            <MetricCard
              title="Team Members"
              value={5}
              change={{ value: 25, type: "increase" }}
              icon={<Users className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Resource Monitoring */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">Resource Usage</h3>
          <ResourceChart />
        </div>

        {/* Activity Log */}
        <div>
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

export default Index;
