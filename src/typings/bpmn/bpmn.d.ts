declare global {
  /**
   * 业务对象类型
   */
  type ExtensionElementsPropertiesType = string | 'flowable:Properties'
  /**
   * 面板类型
   */
  type PanelElementType =
    | string
    | 'bpmn-panel-basic'
    | 'bpmn-panel-condition'
    | 'bpmn-panel-user'
    | 'bpmn-panel-user-copy'
    | 'bpmn-panel-listener-execution'
    | 'bpmn-panel-listener-task'
    | 'bpmn-panel-loop'
    | 'bpmn-panel-properties'
    | 'bpmn-panel-document'
    | 'bpmn-panel-async'
  /**
   * bpmn 元素信息
   */
  interface BpmnElementInfo extends Record<string, any> {
    name: string
    elementType: string
    rawElementType: string
  }

  /**
   * bpmn 属性信息
   */
  interface BpmnProperties {
    name: string
    value: string
  }
  /**
   * 监听器字段信息
   */
  interface ListenerField {
    name: string
    type: 'string' | 'expression'
    value: string
  }
  /**
   *  执行监听器表单信息
   */
  interface ExecutionListenerForm {
    /**
     * 事件类型
     */
    event: 'start' | 'task' | 'end'
    /**
     * 监听器类型
     */
    type: 'class' | 'expression' | 'delegateExpression'
    /**
     * java 类 / 表达式 / 代理表达式 的值
     */
    value: string
    /**
     * 注入字段
     */
    fields: ListenerField[]
  }

  /**
   *  任务监听器表单信息
   */
  interface TaskListenerForm {
    /**
     * 事件类型
     */
    event: 'create' | 'assignment' | 'complete' | 'delete'
    /**
     * 监听器类型
     */
    type: 'class' | 'expression' | 'delegateExpression'
    /**
     * java 类 / 表达式 / 代理表达式 的值
     */
    value: string
    /**
     * 注入字段
     */
    fields: ListenerField[]
  }
}
export {}
