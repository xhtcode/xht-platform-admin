import { getBusinessObject, ModdleElement } from 'bpmn-js/lib/util/ModelUtil'
import { useBpmnPlusHooks } from '@/hooks/use.bpmn'
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { without } from 'lodash'

/**
 * bpmn 任务监听器相关
 */
export const useListenerTaskHooks = () => {
  const bpmnStore = useBpmnStore()
  const { getElementBusinessObject, getExtensionElementsList, createModdleElement } = useBpmnPlusHooks()
  const { modeling, activeElement } = storeToRefs(bpmnStore)

  /**
   * 获取任务监听器列表
   */
  function getTaskListeners(): TaskListenerForm[] {
    const businessObject = getElementBusinessObject(activeElement.value)
    return getExtensionElementsList(businessObject, 'flowable:TaskListener').map((item) => ({
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
   * 添加任务监听器
   * @param data 任务监听器信息
   */
  function addTaskListener(data: TaskListenerForm) {
    const businessObject = getBusinessObject(activeElement.value)
    // 判断 extensionElements
    let extensionElements = businessObject.get('extensionElements')
    if (!extensionElements) {
      extensionElements = createModdleElement('bpmn:ExtensionElements', { values: [] }, businessObject)
      modeling.value?.updateModdleProperties(activeElement.value!, businessObject, { extensionElements })
    }
    // 创建监听器并添加到扩展元素
    const newTaskListener = createTaskListenerElement(data, extensionElements)
    modeling.value?.updateModdleProperties(activeElement.value!, extensionElements, {
      values: [...extensionElements.get('values'), newTaskListener],
    })
  }

  /**
   * 修改任务监听器
   * @param newData 新的任务监听器信息
   * @param index 索引
   */
  function updateTaskListener(newData: TaskListenerForm, index: number) {
    const businessObject = getElementBusinessObject(activeElement.value)
    const taskListener = getExtensionElementsList(businessObject, 'flowable:TaskListener')[index]
    if (!taskListener) return
    // 重新创建注入字段
    const newFields = (newData.fields || []).map((field) => createFieldElement(field, taskListener))
    modeling.value?.updateModdleProperties(activeElement.value!, taskListener, {
      event: newData.event,
      class: newData.type === 'class' ? newData.value : undefined,
      expression: newData.type === 'expression' ? newData.value : undefined,
      delegateExpression: newData.type === 'delegateExpression' ? newData.value : undefined,
      fields: newFields,
    })
  }

  /**
   * 移除任务监听器
   * @param index 索引
   */
  function removeTaskListener(index: number) {
    const businessObject = getElementBusinessObject(activeElement.value)
    const extensionElements = businessObject.get('extensionElements')
    const taskListener = getExtensionElementsList(businessObject, 'flowable:TaskListener')[index]
    if (!extensionElements || !taskListener) return
    modeling.value?.updateModdleProperties(activeElement.value!, extensionElements, {
      values: without(extensionElements.get('values'), taskListener),
    })
  }

  /**
   * 创建任务监听器 moddle 元素
   * @param data 任务监听器信息
   * @param parent 父元素
   */
  function createTaskListenerElement(data: TaskListenerForm, parent: ModdleElement): ModdleElement {
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
    const taskListener = createModdleElement('flowable:TaskListener', properties, parent)
    // 创建注入字段
    taskListener.fields = (data.fields || []).map((field) => createFieldElement(field, taskListener))
    return taskListener
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
    getTaskListeners,
    addTaskListener,
    updateTaskListener,
    removeTaskListener,
  }
}
