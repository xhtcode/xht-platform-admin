import { useBpmnStore } from '@/store/modules/bpmn.store'
import { useBpmnPlusHooks } from '@/hooks/use.bpmn'
import { storeToRefs } from 'pinia'
/**
 * 流程条件hooks
 */
export const useConditionHooks = () => {
  const bpmnStore = useBpmnStore()
  const { getElementBusinessObject } = useBpmnPlusHooks()
  const { modeling, moddle, activeElement } = storeToRefs(bpmnStore)

  /**
   * 初始化流程条件
   */
  function initFlowCondition(): FlowConditionForm {
    // 初始化默认type为default
    let result: FlowConditionForm = {
      type: 'default',
    }
    const businessObject = getElementBusinessObject(activeElement.value!)
    const conditionExpression = businessObject.get('conditionExpression')
    const bpmnElementSourceRef = businessObject.get('sourceRef')
    if (bpmnElementSourceRef && bpmnElementSourceRef.default && bpmnElementSourceRef.default.id === activeElement.value!.id) {
      result.type = 'default'
    } else if (!conditionExpression) {
      // 普通
      result.type = 'normal'
    } else {
      result.type = 'condition'
      result.conditionType = 'expression'
      result.body = conditionExpression.body
      // 带条件 resource 可直接标识 是否是外部资源脚本
      if (conditionExpression.resource) {
        result.conditionType = 'script'
        result.scriptType = 'externalScript'
        result.resource = conditionExpression.resource
      }
      if (conditionExpression.language) {
        result.conditionType = 'script'
        result.scriptType = 'inlineScript'
        result.language = conditionExpression.language
      }
    }
    return result
  }

  /**
   * 更新流程类型
   * @param flowType
   */
  function updateFlowType(flowType: string) {
    const businessObject = getElementBusinessObject(activeElement.value!)
    const bpmnElementSource = activeElement.value!.source
    const bpmnElementSourceRef = businessObject.get('sourceRef')
    // 正常条件类
    if (flowType === 'condition') {
      const flowConditionRef = moddle.value?.create('bpmn:FormalExpression')
      modeling.value!.updateProperties(activeElement.value!, {
        conditionExpression: flowConditionRef,
      })
      return
    }
    // 默认路径
    if (flowType === 'default') {
      modeling.value!.updateProperties(activeElement.value!, {
        conditionExpression: null,
      })
      modeling.value!.updateProperties(bpmnElementSource, {
        default: activeElement.value!,
      })
      return
    }
    // 正常路径，如果来源节点的默认路径是当前连线时，清除父元素的默认路径配置
    if (bpmnElementSourceRef.default && bpmnElementSourceRef.default.id === activeElement.value!.id) {
      modeling.value!.updateProperties(bpmnElementSource, {
        default: null,
      })
    }
    modeling.value!.updateProperties(activeElement.value!, {
      conditionExpression: null,
    })
  }

  /**
   * 更新流程条件
   * @param flowConditionForm
   */
  function updateFlowCondition(flowConditionForm: FlowConditionForm) {
    let { conditionType, scriptType, body, resource, language } = flowConditionForm
    let condition
    if (conditionType === 'expression') {
      condition = moddle.value!.create('bpmn:FormalExpression', { body })
    } else {
      if (scriptType === 'inlineScript') {
        condition = moddle.value!.create('bpmn:FormalExpression', { body, language })
      } else {
        condition = moddle.value!.create('bpmn:FormalExpression', {
          resource,
          language,
        })
      }
    }
    modeling.value!.updateProperties(activeElement.value!, {
      conditionExpression: condition,
    })
  }

  return {
    initFlowCondition,
    updateFlowType,
    updateFlowCondition,
  }
}
