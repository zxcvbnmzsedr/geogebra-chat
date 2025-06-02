import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"
import { logger } from "@/lib/logger"

// 在函数开头添加调试日志
export async function POST(req: Request) {
  try {
    logger.api("收到聊天请求")
    const { messages, configSettings } = await req.json()
    logger.api("请求数据", {
      messageCount: messages.length,
      modelType: configSettings?.modelType,
      systemPromptLength: configSettings?.systemPrompt?.length,
    })

    // Default to OpenAI GPT-4o if no config is provided
    const modelType = configSettings?.modelType || "gpt-4o"
    const systemPrompt =
      configSettings?.systemPrompt ||
      "你是一个专注于数学和GeoGebra的助手。帮助用户理解数学概念并使用GeoGebra进行可视化。"

    // 获取 OpenAI API 密钥和Base URL
    const apiKey = configSettings?.apiKeys?.openai || process.env.OPENAI_API_KEY || ""
    const baseUrl = configSettings?.baseUrl || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"
    logger.api("使用OpenAI API密钥", { keyLength: apiKey?.length || 0, baseUrl })

    if (!apiKey) {
      logger.error("错误 - 缺少OpenAI API密钥")
      return new Response(JSON.stringify({ error: "需要 OpenAI API 密钥，请在设置中配置" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
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
      return new Response(JSON.stringify({ error: "初始化OpenAI模型失败，请检查API密钥和模型配置" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    logger.api("创建流式响应")
    // Create a stream using the AI SDK
    try {
      const result = streamText({
        model,
        system: systemPrompt,
        messages,
      })

      logger.api("返回流式响应")
      // Return the stream response
      return result.toDataStreamResponse({
        headers: {
          "Transfer-Encoding": "chunked",
          Connection: "keep-alive"
        }
      })
    } catch (error) {
      logger.error("创建流式响应错误:", error)
      return new Response(JSON.stringify({ error: "创建聊天流失败，请检查网络连接" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
  } catch (error) {
    logger.error("聊天API错误:", error)
    return new Response(JSON.stringify({ error: "处理聊天请求失败", details: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

