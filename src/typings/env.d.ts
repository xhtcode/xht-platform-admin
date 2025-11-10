// src/types/env.d.ts
interface ImportMetaEnv {
  /**
   * 应用标题
   */
  VITE_APP_TITLE: string
  /**
   * 应用端口
   */
  VITE_APP_PORT: number
  /**
   * API基础路径(反向代理)
   */
  VITE_BASE_API: string
  /**
   * 后端管理gateWay接口地址
   */
  VITE_GATEWAY_API: string
  /**
   * 鉴权服务前缀
   */
  VITE_AUTH_API_PREFIX: string
  /**
   * 后台管理服务前缀
   */
  VITE_ADMIN_API_PREFIX: string
  /**
   * 代码生成器服务前缀
   */
  VITE_GENERATE_API_PREFIX: string
}

export interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * 平台的名称、版本、运行所需的node版本、依赖、构建时间的类型提示
 */
export declare const __APP_INFO__: {
  pkg: {
    name: string
    version: string
    engines: {
      node: string
    }
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
  }
  buildTimestamp: number
}
