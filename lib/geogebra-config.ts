/**
 * GeoGebra 资源配置
 * 支持本地和远程资源的切换
 */

export interface GeoGebraConfig {
  deployScript: string;
  resourcePath?: string;
  useLocal: boolean;
}

// 配置选项
const GEOGEBRA_CONFIGS = {
  // 本地资源配置（适用于内网环境）
  local: {
    deployScript: "/GeoGebra/deployggb.js",
    resourcePath: "/GeoGebra/HTML5/5.0/",
    useLocal: true,
  },
  
  // 远程CDN配置（需要外网访问）
  remote: {
    deployScript: "https://www.geogebra.org/apps/deployggb.js",
    resourcePath: undefined, // 使用默认远程路径
    useLocal: false,
  },
} as const;

/**
 * 获取当前的GeoGebra配置
 * 可以通过环境变量 GEOGEBRA_MODE 控制
 * 默认使用本地资源
 */
export function getGeoGebraConfig(): GeoGebraConfig {
  
  return GEOGEBRA_CONFIGS.local;
}

/**
 * 检查是否应该使用本地资源
 */
export function useLocalGeoGebra(): boolean {
  return getGeoGebraConfig().useLocal;
} 