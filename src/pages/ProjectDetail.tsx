import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { projectsApi, Project } from "@/lib/mcpAPI"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Github,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Globe,
  Server,
  Database
} from "lucide-react"

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { state } = useAuth()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProject = async () => {
    if (!state.token || !projectId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const projectData = await projectsApi.getProject(Number(projectId), state.token)
      setProject(projectData)
    } catch (err: any) {
      toast({
        title: "프로젝트 로드 실패",
        description: err.message || "프로젝트 정보를 불러오는데 실패했습니다.",
        variant: "destructive"
      })
      navigate("/projects")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProject()
  }, [state.token, projectId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deployed":
        return <CheckCircle className="h-5 w-5 text-success" />
      case "building":
        return <Clock className="h-5 w-5 text-warning animate-spin" />
      case "error":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "stopped":
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="h-12 w-12 text-muted-foreground animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            프로젝트 정보를 불러오는 중...
          </h3>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">프로젝트를 찾을 수 없습니다.</p>
            <Button asChild>
              <Link to="/projects">프로젝트 목록으로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Project Title */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            {getStatusIcon(project.status)}
            {getStatusBadge(project.status)}
          </div>
          <p className="text-muted-foreground">
            프로젝트 상세 정보 및 배포 상태를 확인할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Project Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">프로젝트 이름</p>
              <p className="text-foreground">{project.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub Repository
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {project.repository}
                </a>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                마지막 배포일
              </p>
              <p className="text-foreground">
                {project.lastDeployment
                  ? new Date(project.lastDeployment).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : "배포 이력이 없습니다."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              배포 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">배포 상태</p>
              <div className="flex items-center gap-2">
                {getStatusIcon(project.status)}
                {getStatusBadge(project.status)}
              </div>
            </div>
            {project.url && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  배포 URL
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {project.url}
                  </a>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            )}
            {project.service_id && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Service ID</p>
                <p className="text-foreground font-mono text-sm">{project.service_id}</p>
              </div>
            )}
            {project.instance_id && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Instance ID</p>
                <p className="text-foreground font-mono text-sm">{project.instance_id}</p>
              </div>
            )}
            {!project.url && !project.service_id && !project.instance_id && (
              <p className="text-sm text-muted-foreground">배포 정보가 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <Button variant="outline" onClick={loadProject} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
        {project.url && (
          <Button asChild>
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              배포 사이트 열기
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

