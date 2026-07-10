import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil'
import { useMessage } from '@/hooks/use-message'
import { storeToRefs } from 'pinia'
import { useBpmnStore } from '@/store/modules/bpmn.store'
import Modeler from 'bpmn-js/lib/Modeler'
import CustomTranslate from '@/components/bpmn-editor/i18n/CustomTranslate' // 自定义翻译插件
import GridLineModule from 'diagram-js-grid-bg' // 网格背景模块
import MiniMapModule from 'diagram-js-minimap' // 小地图
import { debounce } from 'lodash'
import flowableModdleDescriptor from '@/components/bpmn-editor/flowable.json'

export const useBpmnHooks = () => {
  const bpmnStore = useBpmnStore()
  const { modeler, modeling, activeElement } = storeToRefs(bpmnStore)

  const initModeler = (canvas: HTMLElement) => {
    bpmnStore.setModeler(
      new Modeler({
        container: canvas, // 挂载的元素
        width: '100%', // 宽度100%
        height: '100%', // 高度100%
        additionalModules: [CustomTranslate, GridLineModule, MiniMapModule],
        moddleExtensions: {
          flowable: flowableModdleDescriptor,
        },
        minimap: {
          open: true, // 初始化时默认展开
        },
        gridLine: {
          smallGridSpacing: 20, // 最小网格边长
          gridSpacing: 80, // 大号网格边长
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
    await modeler.value?.importXML(xml)
    modeler.value?.get<any>('canvas').zoom('fit-viewport', 'auto')
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
  function bpmnRef(key: string) {
    return customRef((target, onCleanup) => {
      return {
        get() {
          target()
          return activeElement.value?.businessObject?.get(key)
        },
        set(newValue: any) {
          updateProperties({
            [key]: newValue,
          })
          onCleanup()
        },
      }
    })
  }
  return { initModeler, importXML, bpmnRef }
}
