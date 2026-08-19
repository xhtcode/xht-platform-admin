import { getBusinessObject, ModdleElement } from 'bpmn-js/lib/util/ModelUtil'
import { useBpmnPlusHooks } from '@/hooks/use.bpmn'
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { without } from 'lodash'

/**
 * bpmn 执行监听器相关
 */
export const useListenerExecutionHooks = () => {
  const bpmnStore = useBpmnStore()
  const { getElementBusinessObject, getExtensionElementsList, createModdleElement } = useBpmnPlusHooks()
  const { modeling, activeElement } = storeToRefs(bpmnStore)

  /**
   * 获取执行监听器列表
   */
  function getExecutionListeners(): ExecutionListenerForm[] {
    const businessObject = getElementBusinessObject(activeElement.value)
    return getExtensionElementsList(businessObject, 'flowable:ExecutionListener').map((item) => ({
      event: item.get('event'),
      type: item.get('class') ? 'class' : item.get('expression') ? 'expression' : 'delegateExpression',
      value: item.get('class') || item.get('expression') || item.get('delegateExpression'),
      fields: (item.get('fields') || []).map((field: ModdleElement) => ({
        name: field.get('name'),
        type: field.get('string') ? 'string' : 'expression',
        value: field.get('string') || field.get('expression'),
      })),
    }))
  }

  /**
   * 添加执行监听器
   * @param data 执行监听器信息
   */
  function addExecutionListener(data: ExecutionListenerForm) {
    const businessObject = getBusinessObject(activeElement.value)
    // 判断 extensionElements
    let extensionElements = businessObject.get('extensionElements')
    if (!extensionElements) {
      extensionElements = createModdleElement('bpmn:ExtensionElements', { values: [] }, businessObject)
      modeling.value?.updateModdleProperties(activeElement.value!, businessObject, { extensionElements })
    }
    // 创建监听器并添加到扩展元素
    const newExecutionListener = createExecutionListenerElement(data, extensionElements)
    modeling.value?.updateModdleProperties(activeElement.value!, extensionElements, {
      values: [...extensionElements.get('values'), newExecutionListener],
    })
  }

  /**
   * 修改执行监听器
   * @param newData 新的执行监听器信息
   * @param index 索引
   */
  function updateExecutionListener(newData: ExecutionListenerForm, index: number) {
    const businessObject = getElementBusinessObject(activeElement.value)
    const executionListener = getExtensionElementsList(businessObject, 'flowable:ExecutionListener')[index]
    if (!executionListener) return
    // 重新创建注入字段
    const newFields = (newData.fields || []).map((field) => createFieldElement(field, executionListener))
    modeling.value?.updateModdleProperties(activeElement.value!, executionListener, {
      event: newData.event,
      class: newData.type === 'class' ? newData.value : undefined,
      expression: newData.type === 'expression' ? newData.value : undefined,
      delegateExpression: newData.type === 'delegateExpression' ? newData.value : undefined,
      fields: newFields,
    })
  }

  /**
   * 移除执行监听器
   * @param index 索引
   */
  function removeExecutionListener(index: number) {
    const businessObject = getElementBusinessObject(activeElement.value)
    const extensionElements = businessObject.get('extensionElements')
    const executionListener = getExtensionElementsList(businessObject, 'flowable:ExecutionListener')[index]
    if (!extensionElements || !executionListener) return
    modeling.value?.updateModdleProperties(activeElement.value!, extensionElements, {
      values: without(extensionElements.get('values'), executionListener),
    })
  }

  /**
   * 创建执行监听器 moddle 元素
   * @param data 执行监听器信息
   * @param parent 父元素
   */
  function createExecutionListenerElement(data: ExecutionListenerForm, parent: ModdleElement): ModdleElement {
    const properties: Record<string, any> = {
      event: data.event,
    }
    if (data.type === 'class') {
      properties.class = data.value
    } else if (data.type === 'expression') {
      properties.expression = data.value
    } else {
      properties.delegateExpression = data.value
    }
    const executionListener = createModdleElement('flowable:ExecutionListener', properties, parent)
    // 创建注入字段
    executionListener.fields = (data.fields || []).map((field) => createFieldElement(field, executionListener))
    return executionListener
  }

  /**
   * 创建注入字段 moddle 元素
   * @param field 字段信息
   * @param parent 父元素
   */
  function createFieldElement(field: ListenerField, parent: ModdleElement): ModdleElement {
    const properties: Record<string, any> = {
      name: field.name,
    }
    if (field.type === 'string') {
      properties.string = field.value
    } else {
      properties.expression = field.value
    }
    return createModdleElement('flowable:Field', properties, parent)
  }

  return {
    getExecutionListeners,
    addExecutionListener,
    updateExecutionListener,
    removeExecutionListener,
  }
}
