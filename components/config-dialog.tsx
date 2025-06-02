"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"

export type ApiKeys = {
  openai?: string
}

export type ConfigSettings = {
  modelType: string
  apiKeys: ApiKeys
  baseUrl?: string
  systemPrompt: string
}

interface ConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: () => void
}

export function ConfigDialog({ open, onOpenChange, onSave }: ConfigDialogProps) {
  // 从store获取配置
  const config = useAppStore((state) => state.config)
  const updateConfig = useAppStore((state) => state.updateConfig)
  const updateApiKey = useAppStore((state) => state.updateApiKey)

  // 本地状态用于表单
  const [localConfig, setLocalConfig] = useState<ConfigSettings>(config)
  const [error, setError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("model")

  // 当对话框打开或配置更改时，更新本地状态
  useEffect(() => {
    setLocalConfig(config)
  }, [config, open])

  const handleSave = () => {
    console.debug("配置保存:", localConfig)

    // 检查OpenAI API密钥是否存在
    if (!localConfig.apiKeys.openai) {
      console.debug("API密钥验证失败:", { hasKey: false })
      setError("OpenAI API Key 是必填项")
      setActiveTab("model")
      return
    }

    console.debug("API密钥验证通过:", {
      keyLength: localConfig.apiKeys.openai?.length || 0,
    })

    // 更新store中的配置
    updateConfig(localConfig)

    // 显示保存成功提示
    setSaveSuccess(true)

    // 调用可选的onSave回调
    if (onSave) onSave()

    // 2秒后关闭对话框
    setTimeout(() => {
      setSaveSuccess(false)
      onOpenChange(false)
    }, 2000)

    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>LLM 配置</DialogTitle>
          <DialogDescription>配置聊天应用的语言模型、API密钥和系统提示词。</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="model">模型配置</TabsTrigger>
            <TabsTrigger value="prompt">系统提示词</TabsTrigger>
          </TabsList>

          <TabsContent value="model" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                模型
              </Label>
              <div className="col-span-3">
                <Input
                  id="model"
                  type="text"
                  value={localConfig.modelType}
                  onChange={(e) => setLocalConfig({ ...localConfig, modelType: e.target.value })}
                  placeholder="输入模型名称"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="openaiKey" className="text-right">
                API 密钥
              </Label>
              <div className="col-span-3">
                <Input
                  id="openaiKey"
                  type="password"
                  value={localConfig.apiKeys.openai || ""}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      apiKeys: { ...localConfig.apiKeys, openai: e.target.value },
                    })
                  }
                  placeholder="输入 OpenAI API 密钥"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="baseUrl" className="text-right">
                Base URL
              </Label>
              <div className="col-span-3">
                <Input
                  id="baseUrl"
                  type="text"
                  value={localConfig.baseUrl || ""}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      baseUrl: e.target.value,
                    })
                  }
                  placeholder="https://api.openai.com/v1 (可选，留空使用默认)"
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground mt-2">
              请确保输入正确的模型名称和对应的 API 密钥
            </div>
          </TabsContent>

          <TabsContent value="prompt" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="systemPrompt" className="text-right pt-2">
                系统提示词
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="systemPrompt"
                  value={localConfig.systemPrompt}
                  onChange={(e) => setLocalConfig({ ...localConfig, systemPrompt: e.target.value })}
                  placeholder="输入系统提示词，定义AI助手的行为和知识范围"
                  className="min-h-[150px]"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {saveSuccess && <div className="p-2 bg-green-100 text-green-800 rounded-md text-center">设置已成功保存</div>}
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            保存设置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

