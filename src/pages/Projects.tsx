import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { mcpApi } from "@/lib/mcpAPI"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  Search, 
  Github, 
  Settings, 
  Eye, 
  ExternalLink,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Trash2
} from "lucide-react"
import { Link } from "react-router-dom"

interface Project {
  id: string
  name: string
  repository: string
  status: "deployed" | "building" | "error" | "stopped"
  lastDeployment: string
  url?: string
  service_id?: string  // MCP service_id
  instance_id?: string  // 배포된 인스턴스 ID
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce API",
    repository: "https://github.com/company/ecommerce-api",
    status: "deployed",
    lastDeployment: "2 hours ago",
    url: "https://api.ecommerce.LaunchA.cloud",
    service_id: "svc-1",
    instance_id: "vm-123456"
  },
  {
    id: "2",
    name: "User Dashboard",
    repository: "https://github.com/company/user-dashboard",
    status: "building",
    lastDeployment: "5 minutes ago"
  },
  {
    id: "3",
    name: "Payment Gateway",
    repository: "https://github.com/company/payment-gateway",
    status: "deployed",
    lastDeployment: "1 day ago",
    url: "https://payment.LaunchA.cloud"
  },
  {
    id: "4",
    name: "Analytics Service",
    repository: "https://github.com/company/analytics-service",
    status: "error",
    lastDeployment: "3 hours ago"
  },
  {
    id: "5",
    name: "Auth Service",
    repository: "https://github.com/company/auth-service",
    status: "deployed",
    lastDeployment: "6 hours ago",
    url: "https://auth.LaunchA.cloud"
  },
  {
    id: "6",
    name: "Notification Service",
    repository: "https://github.com/company/notification-service",
    status: "stopped",
    lastDeployment: "2 days ago"
  }
]

export default function Projects() {
  const { state } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [newProject, setNewProject] = useState({ name: "", repository: "" })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.repository.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deployed":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "building":
        return <Clock className="h-4 w-4 text-warning animate-spin" />
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "stopped":
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "deployed":
        return <Badge className="bg-success/10 text-success border-success/20">Deployed</Badge>
      case "building":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Building</Badge>
      case "error":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Error</Badge>
      case "stopped":
        return <Badge variant="secondary">Stopped</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleCreateProject = () => {
    console.log("Creating project:", newProject)
    setIsCreateDialogOpen(false)
    setNewProject({ name: "", repository: "" })
  }

  const handleDestroyProject = async (project: Project) => {
    if (!state.token) {
      toast({
        title: "오류",
        description: "인증 토큰이 없습니다. 다시 로그인해주세요.",
        variant: "destructive"
      })
      return
    }

    if (!project.service_id || !project.instance_id) {
      toast({
        title: "오류",
        description: "프로젝트 정보가 불완전합니다. service_id 또는 instance_id가 없습니다.",
        variant: "destructive"
      })
      return
    }

    setIsDeleting(project.id)
    try {
      await mcpApi.destroy(
        {
          service_id: project.service_id,
          instance_id: project.instance_id,
        },
        state.token
      )
      toast({
        title: "프로젝트 삭제 완료",
        description: `${project.name} 프로젝트가 성공적으로 삭제되었습니다.`,
      })
      // TODO: 실제로는 프로젝트 목록에서 제거하거나 상태를 업데이트해야 함
      // 현재는 목 데이터이므로 UI에서만 제거하는 로직을 추가할 수 있음
    } catch (err: any) {
      toast({
        title: "프로젝트 삭제 실패",
        description: err.message || "프로젝트 삭제에 실패했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your deployment projects and monitor their status
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" className="shadow-glow">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to start automated deployments from your GitHub repository.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="my-awesome-project"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repository">GitHub Repository URL</Label>
                <Input
                  id="repository"
                  placeholder="https://github.com/username/repository"
                  value={newProject.repository}
                  onChange={(e) => setNewProject(prev => ({ ...prev, repository: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateProject}
                disabled={!newProject.name || !newProject.repository}
              >
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="shadow-card transition-smooth hover:shadow-lg">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold">
                  {project.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  {getStatusIcon(project.status)}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Github className="h-4 w-4" />
                <span className="truncate" title={project.repository}>
                  {project.repository.replace('https://github.com/', '')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                {getStatusBadge(project.status)}
                {project.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Last deployed {project.lastDeployment}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/projects/${project.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Details
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/projects/${project.id}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </div>

              {project.service_id && project.instance_id && (
                <div className="pt-2 border-t border-border">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full"
                        disabled={isDeleting === project.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeleting === project.id ? "삭제 중..." : "프로젝트 삭제"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>프로젝트를 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                          이 작업은 되돌릴 수 없습니다. 프로젝트와 모든 관련 리소스가 영구적으로 삭제됩니다.
                          <br />
                          <strong>{project.name}</strong> 프로젝트를 삭제하시겠습니까?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDestroyProject(project)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          삭제
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No projects found
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first project"}
          </p>
          {!searchQuery && (
            <Button variant="hero" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

