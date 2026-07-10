<script setup lang="ts">
import { Download, FolderAdd, View } from '@element-plus/icons-vue'
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { useMessage } from '@/hooks/use-message'
import { ModdleElement } from 'bpmn-js/lib/util/ModelUtil'
import { SaveXMLResult } from 'bpmn-js/lib/BaseViewer'
import { downloadFile } from '@/utils'
import { useBpmnHooks } from '@/hooks/use.bpmn'
defineOptions({
  name: 'BpmnToolbarBasic',
  inheritAttrs: false,
})
const importRef = useTemplateRef('importRef')
const bpmnStore = useBpmnStore()
const { importXML } = useBpmnHooks()
const { modeler } = storeToRefs(bpmnStore)
const xml = ref<string>()
const viewState = ref<boolean>()

/**
 * 保存流程xml
 */
const saveBpmnXml = () => {
  const processName = getProcessName()
  useMessage().success(`流程名称：\`${processName}\`保存成功`)
}
/**
 * 获取流程名称
 */
const getProcessName = () => {
  // modeler 是 bpmn-js 实例
  const definitions: ModdleElement = modeler.value?.getDefinitions()
  if (!definitions) {
    useMessage().error('bpmn 系统错误，无法保存流程')
    return
  }
  // 获取根 process
  const process = definitions.rootElements?.find((el: any) => el.$type === 'bpmn:Process')
  // 流程Key
  return process.name
}
/**
 * 预览流程xml
 */
const viewBpmnXml = () => {
  modeler.value
    ?.saveXML({ format: true, preamble: true })
    .then((result: SaveXMLResult) => {
      xml.value = result.xml
      viewState.value = true
      console.log(result.xml)
    })
    .catch(() => {
      useMessage().error('bpmn 获取xml失败')
    })
}
/**
 * 下载流程xml
 * @param type 文件类型
 */
const downloadBpmn = async (type: 'xml' | 'svg' | 'bpmn') => {
  try {
    const processName = getProcessName()
    // 按需要类型创建文件并下载
    if (type === 'xml' || type === 'bpmn') {
      const { error, xml } = await modeler.value!.saveXML({})
      // 读取异常时抛出异常
      if (error) {
        console.error(`[Process Designer Warn ]: ${error.message || error}`)
      }
      const { href, filename } = setEncoded(type.toUpperCase(), processName, xml!)
      downloadFile(href, filename)
    } else {
      const { svg } = await modeler.value!.saveSVG()
      // 读取异常时抛出异常
      const { href, filename } = setEncoded('SVG', processName, svg!)
      downloadFile(href, filename)
    }
  } catch (e: any) {
    useMessage().error(`[Process Designer Warn ]: ${e.message || e}`)
  }
}
/**
 * 设置编码
 * @param type 文件类型
 * @param filename 文件名
 * @param data 文件内容
 */
function setEncoded(type: string, filename: string, data: string) {
  const encodedData: string = encodeURIComponent(data)
  return {
    filename: `${filename}.${type.toLowerCase()}`,
    href: `data:application/${type === 'svg' ? 'text/xml' : 'bpmn20-xml'};charset=UTF-8,${encodedData}`,
    data: data,
  }
}
/**
 * 导入流程xml
 */
const importXmlFile = () => {
  importRef.value?.click()
}
/**
 * 文件改变
 */
const changeImportFile = () => {
  if (importRef.value && importRef.value.files) {
    const file = importRef.value.files[0]
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function () {
      const xmlStr = this.result
      importXML(xmlStr as string)
        .then(() => {
          useMessage().success('导入流程文件成功')
        })
        .catch((e) => {
          useMessage().error(e.message)
        })
    }
    importRef.value.value = ''
    importRef.value.files = null
  }
}
</script>

<template>
  <div>
    <el-button-group type="primary" size="default">
      <el-tooltip content="保存" placement="bottom">
        <el-button @click="saveBpmnXml">
          <div class="i-common-save"></div>
        </el-button>
      </el-tooltip>
      <el-tooltip content="打开" placement="bottom">
        <el-button @click="importXmlFile">
          <el-icon size="16px"><FolderAdd /></el-icon>
        </el-button>
      </el-tooltip>
      <el-popover placement="top-start" trigger="hover">
        <template #reference>
          <el-button>
            <el-icon size="16px"><Download /></el-icon>
          </el-button>
        </template>
        <template #default>
          <el-space fill alignment="stretch">
            <el-button size="small" @click="downloadBpmn('bpmn')">bpmn</el-button>
            <el-button size="small" @click="downloadBpmn('xml')">xml</el-button>
            <el-button size="small" @click="downloadBpmn('svg')">svg</el-button>
          </el-space>
        </template>
      </el-popover>
      <el-tooltip content="预览" placement="bottom">
        <el-button @click="viewBpmnXml">
          <el-icon size="16px"><View /></el-icon>
        </el-button>
      </el-tooltip>
    </el-button-group>
    <input type="file" ref="importRef" style="display: none" accept=".xml,.bpmn" @change="changeImportFile" />
    <el-drawer v-model="viewState" append-to-body destroy-on-close size="70%" title="流程xml预览">
      <code-monaco-editor v-model="xml" ref="xmlEditor" readonly language="xml" />
    </el-drawer>
  </div>
</template>

<style scoped lang="scss"></style>
