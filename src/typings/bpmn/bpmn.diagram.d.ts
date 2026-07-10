declare module 'diagram-js-minimap' {
  import type { Module } from 'diagram-js'
  /**
   * diagram-js 小地图插件
   * 通常作为 additionalModules 传入 modeler 实例
   */
  const MinimapModule: Module
  export default MinimapModule
}
