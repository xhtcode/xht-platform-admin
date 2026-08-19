import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { useBpmnPlusHooks } from '@/hooks/use.bpmn'
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { without } from 'lodash'

/**
 * bpmn 属性相关
 */
export const usePropertiesHooks = () => {
  const bpmnStore = useBpmnStore()
  const { getElementBusinessObject, getExtensionElementsList, createModdleElement } = useBpmnPlusHooks()
  const { modeling, activeElement } = storeToRefs(bpmnStore)

  /**
   * 获取扩展属性
   */
  function getExtensionProperties(): BpmnProperties[] {
    const businessObject = getElementBusinessObject(activeElement.value)
    return getExtensionElementsList(businessObject, 'flowable:Properties').reduce((pre, current) => pre.concat(current.values), [])
  }

  /**
   * 添加扩展属性
   * @param data 扩展属性
   */
  function addExtensionProperty(data: BpmnProperties) {
    const businessObject = getBusinessObject(activeElement.value)
    // 判断 extensionElements
    let extensionElements = businessObject.get('extensionElements')
    if (!extensionElements) {
      extensionElements = createModdleElement('bpmn:ExtensionElements', { values: [] }, businessObject)
      modeling.value?.updateModdleProperties(activeElement.value!, businessObject, { extensionElements })
    }
    // 判断 extensionElements 是否有 properties
    let properties = getExtensionElementsList(businessObject, 'flowable:Properties')[0]
    if (!properties) {
      properties = createModdleElement(`flowable:Properties`, { values: [] }, extensionElements)
      modeling.value?.updateModdleProperties(activeElement.value!, extensionElements, {
        values: [...extensionElements.get('values'), properties],
      })
    }
    // 创建新属性并添加
    const newProperty = createModdleElement(`flowable:Property`, data, properties)
    modeling.value?.updateModdleProperties(activeElement.value!, properties, {
      values: [...properties.get('values'), newProperty],
    })
  }

  /**
   * 移除扩展属性
   * @param property 属性信息
   */
  function removeExtensionProperty(property: BpmnProperties) {
    const businessObject = getElementBusinessObject(activeElement.value)
    const extensionElements = businessObject.get('extensionElements')
    const properties = getExtensionElementsList(businessObject, 'flowable:Properties')[0]
    if (!properties) return
    const oldValues: any[] = properties.get('values') || []
    const values = oldValues.filter((item) => {
      return !(item.name === property.name && item.value === property.value)
    })
    modeling.value!.updateModdleProperties(activeElement.value!, properties, { values })
    if (!values || !values.length) {
      modeling.value!.updateModdleProperties(activeElement.value!, extensionElements, {
        values: without(extensionElements.get('values'), properties as any),
      })
    }
  }

  /**
   * 修改扩展属性
   * @param newProperty 新属性信息
   * @param index 索引
   */
  function updateExtensionProperty(newProperty: BpmnProperties, index: number) {
    const businessObject = getElementBusinessObject(activeElement.value)
    const properties = getExtensionElementsList(businessObject, 'flowable:Properties')[0]
    if (!properties) return
    const oldValues: any[] = properties.get('values') || []
    oldValues.forEach((item, i) => {
      if (i === index) {
        item.name = newProperty.name
        item.value = newProperty.value
      }
    })
    modeling.value!.updateModdleProperties(activeElement.value!, properties, { values: oldValues })
  }

  return {
    getExtensionProperties,
    addExtensionProperty,
    removeExtensionProperty,
    updateExtensionProperty,
  }
}
