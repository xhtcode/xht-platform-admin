import Setting from './setting'
import Elements from './elements'

const zhCN: Record<string, string> = {
  ...Setting,
  ...Elements,
}

export function customTranslate(template: string, replacements: Record<string, string>) {
  replacements = replacements || {}
  // Translate
  template = zhCN[template] || template
  // Replace
  return template.replace(/{([^}]+)}/g, function (_: any, key: any) {
    return replacements[key] || '{' + key + '}'
  })
}

export default {
  translate: ['value', customTranslate],
}
