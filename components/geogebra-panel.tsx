"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useGeoGebra } from "@/hooks/use-geogebra"
import { Maximize, Minimize, Expand, Shrink } from "lucide-react"

interface GeoGebraPanelProps {
  onHide: () => void
  onExecuteLatestCommands: () => void
  onToggleExpand: () => void
  isExpanded?: boolean
}

export function GeoGebraPanel({ onHide, onExecuteLatestCommands, onToggleExpand, isExpanded = false }: GeoGebraPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const { reset, setSize, isReady } = useGeoGebra()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)

  // 计算尺寸的函数
  const calculateDimensions = useCallback(() => {
    if (!panelRef.current || !titleRef.current) return

    const height = panelRef.current.clientHeight - titleRef.current.clientHeight
    const width = panelRef.current.clientWidth

    // 只有当尺寸真正变化时才更新状态和调整大小
    if (width !== dimensions.width || height !== dimensions.height) {
      setDimensions({ width, height })
      if (isReady && width > 0 && height > 0) {
        setSize(width, height)
        const container = document.getElementById("geogebra-container")
        if (container) {
          container.style.width = width + 'px'
          container.style.height = height + 'px'
        }
      }
    }
  }, [dimensions.width, dimensions.height, isReady, setSize])

  // 切换全屏功能
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  // 处理ESC键退出全屏
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  // 调整GeoGebra大小 - 只在组件挂载和isReady变化时执行
  useEffect(() => {
    if (!isReady) return

    // 初始化时计算一次尺寸
    if (!isInitializedRef.current) {
      calculateDimensions()
      isInitializedRef.current = true
    }

    // 添加防抖的resize事件监听器
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }

      resizeTimeoutRef.current = setTimeout(() => {
        calculateDimensions()
      }, 100)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [isReady, calculateDimensions])

  // 重新计算尺寸当全屏状态改变时
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateDimensions()
    }, 100)

    return () => clearTimeout(timer)
  }, [isFullscreen, isExpanded, calculateDimensions])

  // 动态样式类
  const getPanelClasses = () => {
    if (isFullscreen) {
      return "fixed inset-0 z-50 bg-white flex flex-col h-screen w-screen"
    }
    
    if (isExpanded) {
      return "flex flex-col h-full lg:w-[85%] hidden lg:block border-l"
    }
    
    return "flex flex-col h-full lg:w-[50%] hidden lg:block border-l"
  }

  return (
    <div id="geogebra-panel" ref={panelRef} className={getPanelClasses()}>
      <div id="geogebra-title" ref={titleRef} className="flex items-center justify-between p-4 border-b">
        <h3 className="text-xl font-medium">GeoGebra</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExecuteLatestCommands} className="h-8">
            执行命令
          </Button>
          <Button variant="outline" size="sm" onClick={reset} className="h-8">
            清理
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleExpand} 
            className="h-8"
            title={isExpanded ? "缩小" : "放大"}
          >
            {isExpanded ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen} 
            className="h-8"
            title={isFullscreen ? "退出全屏" : "全屏"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={onHide} className="h-8">
            隐藏
          </Button>
        </div>
      </div>
      <div id="geogebra-container" className="w-full flex-grow"></div>
    </div>
  )
}

