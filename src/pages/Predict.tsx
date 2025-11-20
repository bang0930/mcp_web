import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { mcpApi } from "@/lib/mcpAPI"
import { backendApi } from "@/lib/backendAPI"
import { authApi } from "@/lib/authAPI"
import { CreateProjectDialog, ProjectData } from "@/components/CreateProjectDialog"
import { MetricCard } from "@/components/metric-card"
import { ActivityLog } from "@/components/activity-log"
import { ResourceChart } from "@/components/resource-chart"
import { Button } from "@/components/ui/button"
import { Plus, ExternalLink, RefreshCw, Server, Zap, Activity, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Predict() {
  const { state } = useAuth()
  const { toast } = useToast()
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)

  const handleCreateProject = async (projectData: ProjectData) => {
    if (!state.token) {
      throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.")
    }

    try {
      // 1. 프로젝트 정보를 사용자 프로필에 저장
      try {
        await authApi.updateProfile(
          {
            github_repo_url: projectData.github_repo_url,
            requirements: projectData.requirements,
          },
          state.token
        )
      } catch (apiError: any) {
        // API가 없으면 로컬 스토리지에 저장
        localStorage.setItem("project_data", JSON.stringify(projectData))
      }

      // 2. service_id 생성 (로깅/추적용)
      const serviceId = `svc-${Date.now()}`

      // 3. backend_api에 자연어 + GitHub URL 전달 → /api/predict 호출
      const predictResponse = await backendApi.predictWithNaturalLanguage({
        github_url: projectData.github_repo_url,
        user_input: projectData.requirements,
      })

      // 4. MCP Core Deploy 서버에 배포 요청
      // DeployRequest 스키마에 맞게 JSON 구성
      const deployData = {
        github_url: projectData.github_repo_url,
        repo_id: projectData.github_repo_url.split("/").pop() || projectData.github_repo_url,
        image_tag: "latest",
        env_config: {
          service_id: serviceId,
          // backend_api 예측 결과 일부를 메타데이터로 넘길 수 있음 (옵션)
          recommendations: predictResponse?.recommendations ?? null,
        },
      }

      const deployResponse = await mcpApi.deploy(deployData, state.token)
      
      const flavor = predictResponse?.recommendations?.flavor
      const cost = predictResponse?.recommendations?.cost_per_day

      toast({
        title: "예측 및 배포가 시작되었습니다",
        description: [
          flavor && cost
            ? `추천 스펙: ${flavor} (예상 비용: $${cost}/day)`
            : "자연어 요구사항을 기반으로 리소스를 예측했습니다.",
          `VM 배포를 진행 중입니다. Instance ID: ${deployResponse.instance_id || "할당 대기 중"}`,
        ].join(" "),
      })
    } catch (err: any) {
      throw new Error(err.message || "프로젝트 생성에 실패했습니다.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Welcome to LaunchA
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional CI/CD deployment management for modern development teams. 
              Monitor, deploy, and scale your applications with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg" 
                className="shadow-glow"
                onClick={() => setIsProjectDialogOpen(true)}
              >
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
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
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

      <CreateProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        onSubmit={handleCreateProject}
      />
    </div>
  )
}
