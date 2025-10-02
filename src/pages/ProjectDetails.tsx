import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft,
  ExternalLink,
  Github,
  Cpu,
  HardDrive,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  Terminal,
  Settings as SettingsIcon,
  Bell,
  Slack
} from "lucide-react"

export default function ProjectDetails() {
  const { id } = useParams()
  const [cpuCores, setCpuCores] = useState([2])
  const [ramSize, setRamSize] = useState([4])
  const [floatingIp, setFloatingIp] = useState(true)
  const [slackNotifications, setSlackNotifications] = useState(true)
  const [slackWebhook, setSlackWebhook] = useState("https://hooks.slack.com/services/...")

  // Mock project data
  const project = {
    id: id,
    name: "E-commerce API",
    repository: "https://github.com/company/ecommerce-api",
    status: "deployed",
    url: "https://api.ecommerce.aolda.cloud",
    currentResources: {
      cpu: "2 cores",
      ram: "4 GB",
      ip: "203.0.113.1"
    },
    deployments: [
      {
        id: "1",
        commit: "feat: add payment integration",
        hash: "a1b2c3d",
        status: "success",
        timestamp: "2 hours ago",
        duration: "3m 42s"
      },
      {
        id: "2", 
        commit: "fix: resolve authentication bug",
        hash: "e4f5g6h",
        status: "success",
        timestamp: "1 day ago",
        duration: "2m 18s"
      },
      {
        id: "3",
        commit: "refactor: optimize database queries",
        hash: "i7j8k9l",
        status: "failed",
        timestamp: "2 days ago",
        duration: "1m 33s",
        error: "Test suite failed: 3 tests failing in payment module"
      }
    ]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "pending":
        return <Clock className="h-4 w-4 text-warning animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-success/10 text-success border-success/20">Success</Badge>
      case "failed":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Failed</Badge>
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Project Overview */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <a 
                  href={project.repository} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-smooth"
                >
                  {project.repository.replace('https://github.com/', '')}
                </a>
              </div>
              {project.url && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-smooth"
                  >
                    {project.url}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-success/10 text-success border-success/20">Deployed</Badge>
            <Button variant="outline" asChild>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open App
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67%</div>
                <p className="text-xs text-muted-foreground">
                  {project.currentResources.cpu} allocated
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 GB</div>
                <p className="text-xs text-muted-foreground">
                  of {project.currentResources.ram} allocated
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IP Address</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{project.currentResources.ip}</div>
                <p className="text-xs text-muted-foreground">
                  Floating IP enabled
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployments" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Deployment History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {project.deployments.map((deployment, index) => (
                  <div
                    key={deployment.id}
                    className={`p-4 border-l-2 ${
                      deployment.status === "success" && "border-l-success"
                    } ${
                      deployment.status === "failed" && "border-l-destructive"
                    } ${
                      index !== project.deployments.length - 1 && "border-b border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(deployment.status)}
                        <div>
                          <h4 className="font-medium text-foreground">{deployment.commit}</h4>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-mono">{deployment.hash}</span> • {deployment.timestamp} • {deployment.duration}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(deployment.status)}
                    </div>
                    
                    {deployment.error && (
                      <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <p className="text-sm text-destructive font-mono">{deployment.error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Resource Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">CPU Cores</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Allocate CPU cores for your application
                  </p>
                  <div className="space-y-3">
                    <Slider
                      value={cpuCores}
                      onValueChange={setCpuCores}
                      max={8}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1 core</span>
                      <span className="font-medium text-foreground">{cpuCores[0]} cores</span>
                      <span>8 cores</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">RAM (GB)</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure memory allocation
                  </p>
                  <div className="space-y-3">
                    <Slider
                      value={ramSize}
                      onValueChange={setRamSize}
                      max={32}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1 GB</span>
                      <span className="font-medium text-foreground">{ramSize[0]} GB</span>
                      <span>32 GB</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Floating IP</Label>
                    <p className="text-sm text-muted-foreground">
                      Assign a dedicated IP address to your application
                    </p>
                  </div>
                  <Switch checked={floatingIp} onCheckedChange={setFloatingIp} />
                </div>
              </div>

              <Button variant="hero" className="w-full">
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Slack className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="text-base font-medium">Slack Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive deployment notifications in Slack
                    </p>
                  </div>
                </div>
                <Switch checked={slackNotifications} onCheckedChange={setSlackNotifications} />
              </div>

              {slackNotifications && (
                <div className="space-y-2">
                  <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                  <Input
                    id="slack-webhook"
                    placeholder="https://hooks.slack.com/services/..."
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your webhook URL from your Slack workspace settings
                  </p>
                </div>
              )}

              <Button variant="hero" className="w-full">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}