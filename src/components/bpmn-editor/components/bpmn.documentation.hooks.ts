import { Element } from 'bpmn-js/lib/model/Types'
import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import { without } from 'lodash'
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
const DOCUMENTATION_TEXT_FORMAT = 'text/plain'

export const useDocumentationHooks = () => {
  const store = useBpmnStore()
  const { modeling, modeler } = storeToRefs(store)

  /**
   * 获取文档值
   * @param element
   */
  function getDocumentValue(element?: Element): string {
    const businessObject = element?.businessObject
    const documentation = businessObject && findDocumentation(businessObject.get('documentation'))
    return documentation && documentation.text
  }

  /**
   * 设置文档值
   * @param element
   * @param value
   */
  function setDocumentValue(element?: Element, value?: string) {
    if (!element) return
    const bpmnFactory: BpmnFactory | undefined = modeler.value?.get('bpmnFactory')
    const businessObject = element.businessObject
    const documentation = findDocumentation(businessObject && businessObject.get('documentation'))
    // (1) 更新或者移除 原有 documentation
    if (documentation) {
      if (value) {
        return modeling.value?.updateModdleProperties(element, documentation, { text: value })
      } else {
        return modeling.value?.updateModdleProperties(element, businessObject, {
          documentation: without(businessObject.get('documentation'), documentation),
        })
      }
    }
    // (2) 创建新的 documentation
    if (value) {
      const newDocumentation = bpmnFactory?.create('bpmn:Documentation', {
        text: value,
      })
      return modeling.value?.updateModdleProperties(element, businessObject, {
        documentation: [...businessObject.get('documentation'), newDocumentation],
      })
    }
  }
  return { getDocumentValue, setDocumentValue }
}

function findDocumentation(docs: any) {
  return docs.find(function (d: any) {
    return (d.textFormat || DOCUMENTATION_TEXT_FORMAT) === DOCUMENTATION_TEXT_FORMAT
  })
}
