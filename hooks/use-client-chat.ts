import { useState, useCallback, useRef, useEffect } from "react"
import { ChatClient, type ChatMessage, type ChatConfig } from "@/lib/chat-client"
import { logger } from "@/lib/logger"

export type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export type UseClientChatOptions = {
  id?: string
  initialMessages?: Message[]
  config?: ChatConfig
  onResponse?: (response: any) => void
  onFinish?: (message: Message, messages: Message[]) => void
  onError?: (error: Error) => void
}

export function useClientChat({
  id = "default",
  initialMessages = [],
  config = {},
  onResponse,
  onFinish,
  onError,
}: UseClientChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const chatClientRef = useRef<ChatClient | null>(null)
  const configRef = useRef<ChatConfig>({})
  
  // 当配置变化时，更新客户端
  useEffect(() => {
    if (JSON.stringify(config) !== JSON.stringify(configRef.current)) {
      configRef.current = config
      chatClientRef.current = new ChatClient(config)
    }
  }, [config])

  // 当初始消息变化时更新消息状态
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) {
      return
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      role: "user",
      content: input.trim(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // 确保客户端已初始化
      if (!chatClientRef.current) {
        chatClientRef.current = new ChatClient(config)
      }
      
      // 转换消息格式
      const chatMessages: ChatMessage[] = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }))

      logger.info("发送聊天请求", { messageCount: chatMessages.length })
      
      if (onResponse) {
        onResponse({ ok: true })
      }

      const result = await chatClientRef.current.sendMessage(chatMessages)
      
      // 创建助手消息
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        role: "assistant",
        content: "",
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)

      // 处理流式响应
      let fullContent = ""
      for await (const delta of result.textStream) {
        fullContent += delta
        setMessages(prev => {
          const updated = [...prev]
          const lastMessage = updated[updated.length - 1]
          if (lastMessage && lastMessage.role === "assistant") {
            lastMessage.content = fullContent
          }
          return updated
        })
      }

      // 完成回调
      const finalAssistantMessage: Message = {
        ...assistantMessage,
        content: fullContent,
      }
      
      const completedMessages = [...newMessages, finalAssistantMessage]
      setMessages(completedMessages)
      
      if (onFinish) {
        onFinish(finalAssistantMessage, completedMessages)
      }

      logger.info("聊天完成", { contentLength: fullContent.length })

    } catch (err) {
      const error = err instanceof Error ? err : new Error("聊天请求失败")
      logger.error("聊天错误:", error)
      setError(error)
      
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, config, onResponse, onFinish, onError])

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
  }
} 