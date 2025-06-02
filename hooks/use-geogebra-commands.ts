"use client"

import {useCallback} from "react"

export function useGeoGebraCommands() {
    // 从消息内容中提取GeoGebra命令
    const extractCommands = useCallback((content: string): string[] => {
        if (!content) return []

        const commands: string[] = []

        // 匹配形如 `ggb:命令` 的内容
        const ggbRegex = /`ggb:([^`]+)`/g
        let match
        while ((match = ggbRegex.exec(content)) !== null) {
            commands.push(match[1].trim())
        }

        // 匹配代码块中的GeoGebra命令
        const codeBlockRegex = /```geogebra\n([\s\S]*?)```/g
        let codeMatch
        while ((codeMatch = codeBlockRegex.exec(content)) !== null) {
            const blockCommands = codeMatch[1].split("\n").filter((line) => line.trim() !== "")
            commands.push(...blockCommands)
        }
        // 筛选无效的命令，空行、空格、注释行
        const result = commands.filter((cmd) => {
            return cmd.trim() !== "" && !cmd.startsWith("//")
        })

        // 如果结果中包含有注释，则删除注释内容
        const cleanedCommands = result.map((cmd) => {
            // 删除行内注释 (// 后面的内容)
            const commentIndex = cmd.indexOf("//")
            if (commentIndex !== -1) {
                // 检查 // 是否在字符串内部
                const beforeComment = cmd.substring(0, commentIndex)
                const quoteCount = (beforeComment.match(/"/g) || []).length
                
                // 如果 // 前面有奇数个引号，说明 // 在字符串内部，不是注释
                if (quoteCount % 2 === 0) {
                    cmd = cmd.substring(0, commentIndex)
                }
            }
            return cmd.trim()
        }).filter((cmd) => cmd !== "") // 过滤掉删除注释后变为空的命令

        return cleanedCommands

    }, [])

    // 从消息数组中提取最新助手消息的命令
    const extractLatestCommands = useCallback(
        (messages: any[]): string[] => {
            if (!messages || messages.length === 0) return []

            // 查找最新的助手消息
            const latestAssistantMessage = [...messages].reverse().find((msg) => msg.role === "assistant")
            if (!latestAssistantMessage || !latestAssistantMessage.content) return []

            return extractCommands(latestAssistantMessage.content)
        },
        [extractCommands],
    )

    // 为所有消息提取命令
    const extractAllMessagesCommands = useCallback(
        (messages: any[]): Record<string, string[]> => {
            if (!messages || messages.length === 0) return {}

            const result: Record<string, string[]> = {}

            messages.forEach((message, index) => {
                if (message.role === "assistant" && message.content) {
                    const id = message.id || `msg-${index}`
                    result[id] = extractCommands(message.content)
                }
            })

            return result
        },
        [extractCommands],
    )

    return {
        extractCommands,
        extractLatestCommands,
        extractAllMessagesCommands,
    }
}

