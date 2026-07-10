import { defineStore } from 'pinia'
import Modeler from 'bpmn-js/lib/Modeler'
import Modeling from 'bpmn-js/lib/features/modeling/Modeling'
import { Element } from 'bpmn-js/lib/model/Types'
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import { Selection } from 'bpmn-js/lib/features/label-link/LabelLink'
import { Canvas } from 'bpmn-js/lib/features/context-pad/ContextPadProvider'

export const useBpmnStore = defineStore('bpmn', () => {
  const modeler = shallowRef<Modeler>()
  const canvas = shallowRef<Canvas>()
  const elementRegistry = shallowRef<ElementRegistry>()
  const modeling = shallowRef<Modeling>()
  const activeElement = shallowRef<Element>()
  const activeElementId = ref<string>()
  const selection = shallowRef<Selection>()
  const selectionAlign = shallowRef<any>()
  const setModeler = (mod?: Modeler) => {
    modeler.value = mod
    if (mod) {
      modeling.value = modeler.value?.get<Modeling>('modeling')
      canvas.value = modeler.value?.get<Canvas>('canvas')
      elementRegistry.value = modeler.value?.get<ElementRegistry>('elementRegistry')
    }
  }
  const setElement = (element: any) => {
    if (!element) {
      element =
        elementRegistry.value?.find((el) => el.type === 'bpmn:Process') || elementRegistry.value?.find((el) => el.type === 'bpmn:Collaboration')
    }
    activeElement.value = element
    activeElementId.value = element?.id
  }
  const selectionModelerInit = (modeler: Modeler) => {
    selection.value = modeler.get<Selection>('selection')
    selectionAlign.value = modeler.get<any>('alignElements')
  }
  return {
    modeler,
    canvas,
    modeling,
    activeElement,
    activeElementId,
    selection,
    selectionAlign,
    setModeler,
    setElement,
    selectionModelerInit,
  }
})
