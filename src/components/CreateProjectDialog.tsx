import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ProjectData) => Promise<void>
}

export interface ProjectData {
  github_repo_url: string
  requirements: string // 자연어 요청사항
}

export function CreateProjectDialog({ open, onOpenChange, onSubmit }: CreateProjectDialogProps) {
  const [formData, setFormData] = useState<ProjectData>({
    github_repo_url: "",
    requirements: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await onSubmit(formData)
      // 성공 시 폼 초기화 및 다이얼로그 닫기
      setFormData({
        github_repo_url: "",
        requirements: "",
      })
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "프로젝트 생성에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>새 프로젝트 생성</DialogTitle>
          <DialogDescription>
            프로젝트 정보를 입력하여 예측 서비스를 시작하세요
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="github_repo_url">GitHub Repository URL</Label>
              <Input
                id="github_repo_url"
                name="github_repo_url"
                type="url"
                placeholder="https://github.com/username/repo"
                value={formData.github_repo_url}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">요청사항 (자연어)</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="예: 예상 사용자 수는 100명 정도이고, 피크 시간대는 오후 2시~4시입니다. 높은 가용성이 필요합니다."
                value={formData.requirements}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                프로젝트의 요구사항을 자연어로 입력해주세요. (예상 사용자 수, 피크 시간대, 성능 요구사항 등)
              </p>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "생성 중..." : "프로젝트 생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

