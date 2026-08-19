import { Element, getBusinessObject, is, ModdleElement } from 'bpmn-js/lib/util/ModelUtil'
import { useMessage } from '@/hooks/use-message'
import { storeToRefs } from 'pinia'
import { useBpmnStore } from '@/store/modules/bpmn.store'
import Modeler from 'bpmn-js/lib/Modeler'
import CustomTranslate from '@/components/bpmn-editor/i18n/CustomTranslate' // 自定义翻译插件
import GridLineModule from 'diagram-js-grid-bg' // 网格背景模块
import MiniMapModule from 'diagram-js-minimap' // 小地图
import { debounce } from 'lodash'
import flowableModdleDescriptor from '@/components/bpmn-editor/flowable.json'
import { CustomPaletteModule } from '@/components/bpmn-editor/palette/CustomPalette'
import { find } from 'lodash'

/**
 * bpmn 钩子
 */
export const useBpmnHooks = () => {
  const bpmnStore = useBpmnStore()
  const { modeler, modeling, activeElement } = storeToRefs(bpmnStore)

  const initModeler = (canvas: HTMLElement) => {
    bpmnStore.setModeler(
      new Modeler({
        container: canvas, // 挂载的元素
        width: '100%', // 宽度100%
        height: '100%', // 高度100%
        additionalModules: [CustomTranslate, GridLineModule, MiniMapModule, CustomPaletteModule],
        moddleExtensions: {
          flowable: flowableModdleDescriptor,
        },
        minimap: {
          open: true, // 初始化时默认展开
        },
        gridLine: {
          smallGridSpacing: 10, // 最小网格边长
          gridSpacing: 40, // 大号网格边长
          gridLineStroke: 0.5, // 网格边框宽度
          gridLineOpacity: 0.4, // 网格边框透明度
          gridLineColor: 'var(--el-color-info-light-5)', // 网格边框颜色
        },
      })
    )
    const eventBus = modeler.value?.get<any>('eventBus')
    eventBus.on(
      'selection.changed',
      debounce(({ newSelection = [] }) => {
        bpmnStore.setElement(newSelection[0] || null)
      }, 100)
    )
    bpmnStore.selectionModelerInit(modeler.value!)
  }
  /**
   * 导入XML
   * @param xml
   */
  const importXML = async (xml: string) => {
    return new Promise((resolve, reject) => {
      modeler.value
        ?.importXML(xml)
        .then(() => {
          modeler.value?.get<any>('canvas').zoom('fit-viewport', {
            x: 0,
            y: 0,
          })
          resolve(true)
        })
        .catch(() => {
          reject()
        })
    })
  }

  /**
   * 更新属性
   * @param props
   */
  function updateProperties(props: Record<any, any>) {
    if (activeElement.value) {
      const businessObject = getBusinessObject(activeElement.value)
      modeling.value?.updateModdleProperties(activeElement.value, businessObject, props)
    } else {
      useMessage().error('请选择节点')
    }
  }
  /**
   * 自定义 bpmn ref
   * @param key
   * @returns
   */
  function bpmnRef<T = any>(key: string) {
    return customRef<T | undefined, T | null | undefined>((track, trigger) => {
      return {
        get() {
          track() // 收集依赖
          return activeElement.value?.businessObject?.get(key)
        },
        set(newValue) {
          updateProperties({
            [key]: newValue,
          })
          trigger() // 触发更新
        },
      }
    })
  }
  return { initModeler, importXML, bpmnRef }
}

/**
 * bpmn 扩展钩子
 */
export const useBpmnPlusHooks = () => {
  const bpmnStore = useBpmnStore()
  const { moddle } = storeToRefs(bpmnStore)
  /**
   * 获取业务对象
   * @param element 节点信息 或者 businessObject
   */
  function getElementBusinessObject(element: Element | ModdleElement): ModdleElement {
    const businessObject = getBusinessObject(element)
    if (is(element, 'bpmn:Participant')) {
      return businessObject.get('processRef')
    }
    return businessObject
  }

  /**
   * 获取节点扩展元素列表
   * @param businessObject - bpmn 业务对象(businessObject)
   * @param type - 【可选】扩展元素类型，例如 'flowable:Properties'；不传则返回全部扩展元素
   * @returns 匹配的扩展元素数组，无数据时返回空数组
   */
  function getExtensionElementsList(businessObject: ModdleElement, type?: ExtensionElementsPropertiesType): ModdleElement[] {
    const extensionElements = businessObject?.get('extensionElements')
    if (!extensionElements) return []
    const values: ModdleElement[] = extensionElements.get('values')
    if (!values || !values.length) return []
    if (type) {
      return values.filter((value: ModdleElement) => is(value, type))
    }
    return values
  }

  /**
   * 创建 moddle 元素
   * @param elementType - 元素类型
   * @param properties - 元素属性
   * @param parent - 父元素
   * @returns
   */
  function createModdleElement(
    elementType: string | 'bpmn:FormalExpression' | 'bpmn:ExtensionElements' | 'flowable:Properties' | 'flowable:Property',
    properties: Record<string, any>,
    parent?: Element | ModdleElement
  ): ModdleElement {
    const element = moddle.value?.create(elementType, properties)
    parent && (element.$parent = parent)
    return element
  }
  function getEventDefinition(element: Element | ModdleElement, eventType: string): ModdleElement | undefined {
    const businessObject = getBusinessObject(element)
    const eventDefinitions = businessObject.get('eventDefinitions') || []
    return find(eventDefinitions, function (definition) {
      return is(definition, eventType)
    })
  }
  return { getElementBusinessObject, getExtensionElementsList, createModdleElement, getEventDefinition }
}
