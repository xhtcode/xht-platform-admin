import { getBusinessObject, is, ModdleElement } from 'bpmn-js/lib/util/ModelUtil'
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { useBpmnPlusHooks } from '@/hooks/use.bpmn'
import { storeToRefs } from 'pinia'

/**
 * 用户任务相关hooks
 */
export const useBpmnUserHooks = () => {
  const bpmnStore = useBpmnStore()
  const { getElementBusinessObject, getExtensionElementsList, createModdleElement } = useBpmnPlusHooks()
  const { modeling, moddle, activeElement } = storeToRefs(bpmnStore)

  /**
   * 获取用户任务的assigneeType
   */
  function getAssigneeType(): UserAssigneeType {
    const businessObject = getElementBusinessObject(activeElement.value)
    const extensionElements = getExtensionElementsList(businessObject, 'flowable:assigneeType')[0]
    return extensionElements ? extensionElements.body || 'static' : 'static'
  }

  /**
   * 添加用户任务的assigneeType
   * @param assigneeType 用户任务的assigneeType
   */
  function updateAssigneeType(assigneeType: UserAssigneeType) {
    const businessObject = getBusinessObject(activeElement.value)
    // 判断 extensionElements
    let extensionElements = businessObject.get('extensionElements')
    if (!extensionElements) {
      extensionElements = createModdleElement('bpmn:ExtensionElements', { values: [] }, businessObject)
      modeling.value?.updateModdleProperties(activeElement.value!, businessObject, { extensionElements })
    }
    let assigneeTypeElement = getExtensionElementsList(businessObject, 'flowable:assigneeType')[0]
    if (assigneeTypeElement) {
      // 修改
      modeling.value?.updateModdleProperties(activeElement.value!, assigneeTypeElement, { body: assigneeType })
    } else {
      // 创建
      assigneeTypeElement = moddle.value?.create('flowable:assigneeType', { body: assigneeType })
      extensionElements && (assigneeTypeElement.$parent = extensionElements)
      modeling.value?.updateModdleProperties(activeElement.value!, extensionElements, {
        values: [...extensionElements.get('values'), assigneeTypeElement],
      })
    }
  }

  return { getAssigneeType, updateAssigneeType }
}
