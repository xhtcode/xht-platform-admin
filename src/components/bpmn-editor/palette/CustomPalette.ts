import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'
import type { Translate } from 'bpmn-js/lib/features/palette/PaletteProvider'
import type { PaletteEntries } from 'diagram-js/lib/features/palette/Palette'
import Create from 'diagram-js/lib/features/create/Create'
import ElementFactory from 'diagram-js/lib/core/ElementFactory'

/**
 * 自定义 palette 提供器
 * 将左侧"任务"默认创建为用户任务(bpmn:UserTask)
 */
export default class CustomPaletteProvider extends PaletteProvider {
  // 使用 declare 声明，避免 useDefineForClassFields 生成字段定义覆盖父类注入的依赖
  declare private _create: Create
  declare private _elementFactory: ElementFactory
  declare private _translate: Translate

  getPaletteEntries(): PaletteEntries {
    const entries = super.getPaletteEntries()
    const taskEntry = entries['create.task']
    if (taskEntry) {
      // 创建用户任务
      const createUserTask = (event: any, _: any) => {
        const shape = this._elementFactory.createShape({ type: 'bpmn:UserTask' })
        this._create.start(event, shape)
      }
      taskEntry.className = 'bpmn-icon-user-task'
      taskEntry.title = this._translate('Create user task')
      taskEntry.action = {
        click: createUserTask,
        dragstart: createUserTask,
      }
    }
    return entries
  }
}

/**
 * 自定义 palette 模块
 */
const CustomPaletteModule = {
  __init__: ['customPaletteProvider'],
  customPaletteProvider: ['type', CustomPaletteProvider],
}

export { CustomPaletteModule }
