import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"
import { logger } from "@/lib/logger"

export type ChatMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

export type ChatConfig = {
  modelType?: string
  systemPrompt?: string
  apiKeys?: {
    openai?: string
  }
  baseUrl?: string
}

export class ChatClient {
  private config: ChatConfig

  constructor(config: ChatConfig) {
    this.config = config
  }

  async sendMessage(messages: ChatMessage[]) {
    logger.api("客户端发送聊天请求")
    logger.api("请求数据", {
      messageCount: messages.length,
      modelType: this.config?.modelType,
      systemPromptLength: this.config?.systemPrompt?.length,
    })

    // Default to OpenAI GPT-4o if no config is provided
    const modelType = this.config?.modelType || "gpt-4o"
    const systemPrompt =
      this.config?.systemPrompt ||
      "你是一个专注于数学和GeoGebra的助手。帮助用户理解数学概念并使用GeoGebra进行可视化。"

    // 获取 OpenAI API 密钥和Base URL
    const apiKey = this.config?.apiKeys?.openai || ""
    const baseUrl = this.config?.baseUrl || "https://api.openai.com/v1"
    logger.api("使用OpenAI API密钥", { keyLength: apiKey?.length || 0, baseUrl })

    if (!apiKey) {
      logger.error("错误 - 缺少OpenAI API密钥")
      throw new Error("需要 OpenAI API 密钥，请在设置中配置")
    }

    // 初始化 OpenAI 模型
    let model, the_model

    try {
      logger.api("初始化OpenAI模型", { model: modelType })
      the_model = createOpenAI({
        apiKey,
        baseURL: baseUrl
      })
      model = the_model(modelType)
    } catch (error) {
      logger.error("初始化OpenAI模型错误:", error)
      throw new Error("初始化OpenAI模型失败，请检查API密钥和模型配置")
    }

    logger.api("创建流式响应")
    // Create a stream using the AI SDK
    try {
      const result = await streamText({
        model,
        system: systemPrompt,
        messages,
      })

      logger.api("返回流式响应")
      return result
    } catch (error) {
      logger.error("创建流式响应错误:", error)
      throw new Error("创建聊天流失败，请检查网络连接")
    }
  }
} 