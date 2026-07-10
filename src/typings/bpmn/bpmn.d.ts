declare global {
  /**
   * bpmn 元素信息
   */
  export interface BpmnElementInfo extends Record<string, any> {
    name: string
    elementType: string
    rawElementType: string
  }
}
export {}
