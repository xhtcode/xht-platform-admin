import { ModdleElement } from 'bpmn-js/lib/util/ModelUtil'
import { useBpmnPlusHooks } from '@/hooks/use.bpmn'
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'

/**
 * 多实例类型
 */
type BpmnLoopType = 'none' | 'parallel' | 'sequential'

/**
 * 多实例属性
 */
interface BpmnLoopProperties {
  loopCardinality: string
  loopCollection: string
  loopVariable: string
  loopCompletionCondition: string
}

/**
 * bpmn 多实例(循环)相关
 */
export const useBpmnLoopHooks = () => {
  const bpmnStore = useBpmnStore()
  const { getElementBusinessObject, createModdleElement } = useBpmnPlusHooks()
  const { modeling, activeElement } = storeToRefs(bpmnStore)

  /**
   * 获取多实例特性
   */
  function getLoopCharacteristics(): ModdleElement | undefined {
    const businessObject = getElementBusinessObject(activeElement.value)
    return businessObject?.get('loopCharacteristics')
  }

  /**
   * 获取多实例类型
   */
  function getLoopType(): BpmnLoopType {
    const loopCharacteristics = getLoopCharacteristics()
    if (!loopCharacteristics) return 'none'
    if (loopCharacteristics.isSequential) return 'sequential'
    if (
      loopCharacteristics.loopCardinality ||
      loopCharacteristics.collection ||
      loopCharacteristics.elementVariable ||
      loopCharacteristics.completionCondition
    ) {
      return 'parallel'
    }
    return 'none'
  }

  /**
   * 获取多实例属性
   */
  function getLoopProperties(): BpmnLoopProperties {
    const loopCharacteristics = getLoopCharacteristics()
    let loopCardinality = ''
    let loopCollection = ''
    let loopVariable = ''
    let loopCompletionCondition = ''
    if (loopCharacteristics) {
      if (loopCharacteristics.loopCardinality) {
        loopCardinality = loopCharacteristics.loopCardinality.body
      }
      if (loopCharacteristics.collection) {
        loopCollection = loopCharacteristics.collection
      }
      if (loopCharacteristics.elementVariable) {
        loopVariable = loopCharacteristics.elementVariable
      }
      if (loopCharacteristics.completionCondition) {
        loopCompletionCondition = loopCharacteristics.completionCondition.body
      }
    }
    return { loopCardinality, loopCollection, loopVariable, loopCompletionCondition }
  }

  /**
   * 更新多实例类型
   * @param loopType 多实例类型
   */
  function updateLoopType(loopType: BpmnLoopType) {
    const businessObject = getElementBusinessObject(activeElement.value)
    const loopCharacteristics = getLoopCharacteristics()
    // 移除多实例配置
    if (loopType === 'none') {
      if (loopCharacteristics) {
        modeling.value?.updateModdleProperties(activeElement.value!, businessObject, {
          loopCharacteristics: undefined,
        })
      }
      return
    }
    // 创建多实例特性
    let currentLoopCharacteristics = loopCharacteristics
    if (!currentLoopCharacteristics) {
      currentLoopCharacteristics = createModdleElement('bpmn:MultiInstanceLoopCharacteristics', {}, businessObject)
      modeling.value?.updateModdleProperties(activeElement.value!, businessObject, {
        loopCharacteristics: currentLoopCharacteristics,
      })
    }
    // 更新串行/并行
    modeling.value?.updateModdleProperties(activeElement.value!, currentLoopCharacteristics, {
      isSequential: loopType === 'sequential',
    })
  }

  /**
   * 更新多实例属性
   * @param loopProperties 多实例属性
   */
  function updateLoopProperties(loopProperties: BpmnLoopProperties) {
    const { loopCardinality, loopCollection, loopVariable, loopCompletionCondition } = loopProperties
    const loopCharacteristics = getLoopCharacteristics()
    if (!loopCharacteristics) return
    // 创建基数表达式
    let newLoopCardinality
    if (loopCardinality) {
      newLoopCardinality = createModdleElement('bpmn:FormalExpression', { body: loopCardinality }, loopCharacteristics)
    }
    // 创建完成条件表达式
    let newCompletionCondition
    if (loopCompletionCondition) {
      newCompletionCondition = createModdleElement('bpmn:FormalExpression', { body: loopCompletionCondition }, loopCharacteristics)
    }
    modeling.value?.updateModdleProperties(activeElement.value!, loopCharacteristics, {
      loopCardinality: newLoopCardinality,
      collection: loopCollection,
      elementVariable: loopVariable,
      completionCondition: newCompletionCondition,
    })
  }

  return {
    getLoopType,
    getLoopProperties,
    updateLoopType,
    updateLoopProperties,
  }
}
