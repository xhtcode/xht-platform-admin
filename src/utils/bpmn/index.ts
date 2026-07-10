import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { Element } from 'bpmn-js/lib/model/Types'
import { customTranslate } from '@/components/bpmn-editor/i18n/CustomTranslate'

/**
 * 获取 bpmn-js 元素信息
 * @param element  bpmn-js 元素实例
 */
export function getBpmnElementInfo(element?: Element): BpmnElementInfo {
  if (!element) {
    return {} as BpmnElementInfo
  }
  const elementType = element.type
  let type = getRawType(elementType)

  const eventDefinition = getEventDefinition(element)
  if (!eventDefinition) {
    return {
      name: customTranslate(type || 'Process', {}),
      elementType: type,
      rawElementType: elementType,
    }
  }
  // 拼接事件定义前缀
  type = `${getEventDefinitionPrefix(eventDefinition)}${type}`
  // 非中断事件追加后缀
  const isStartNonInterrupt = is(element, 'bpmn:StartEvent') && !isInterrupting(element)
  const isBoundaryNonInterrupt = is(element, 'bpmn:BoundaryEvent') && !isCancelActivity(element)
  if (isStartNonInterrupt || isBoundaryNonInterrupt) {
    type = `${type}NonInterrupting`
  }
  return {
    name: customTranslate(type || 'Process', {}),
    elementType: elementType,
    rawElementType: type,
  }
}

/**
 * 去掉命名空间前缀，获取原始类型名
 * @param type  bpmn-js 元素类型
 */
function getRawType(type: string): string {
  return type.split(':')[1] ?? type
}

/**
 * 判断边界事件是否为中断模式（cancelActivity 默认 true）
 * @param element  bpmn-js 元素实例
 */
function isCancelActivity(element: Element): boolean {
  const businessObject = getBusinessObject(element)
  return businessObject?.cancelActivity !== false
}

/**
 * 判断开始事件是否为中断模式（isInterrupting 默认 true）
 * @param element  bpmn-js 元素实例
 */
function isInterrupting(element: Element): boolean {
  const businessObject = getBusinessObject(element)
  return businessObject?.isInterrupting !== false
}

/**
 * 获取元素的第一个事件定义
 * @param element  bpmn-js 元素实例
 */
function getEventDefinition(element: Element): any | undefined {
  const businessObject = getBusinessObject(element)
  const eventDefinitions = businessObject?.eventDefinitions
  return eventDefinitions?.[0]
}

/**
 * 提取事件定义的语义前缀
 * @param eventDefinition  bpmn-js 元素实例
 */
function getEventDefinitionPrefix(eventDefinition: { $type: string }): string {
  const rawType = getRawType(eventDefinition.$type)
  return rawType.replace('EventDefinition', '')
}
