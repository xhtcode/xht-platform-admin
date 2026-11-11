<script setup lang="ts">
import { Share } from '@element-plus/icons-vue'
import { useMessage } from '@/hooks/use-message.ts'
import { XhtFileShareProps } from '@/components/xht-file-share/types.ts'
import FileShareCreate from '@/views/system/file-share/components/file-share-create.vue'

defineOptions({
  name: 'XhtFileShare',
})
const props = withDefaults(defineProps<XhtFileShareProps>(), {})
const fileShareCreateRef = useTemplateRef('fileShareCreateRef')
/**
 * 触发分享
 */
const handleShare = () => {
  fileShareCreateRef.value?.show(props.previewInit)
}
</script>

<template>
  <div @click="handleShare">
    <el-icon :size="18">
      <Share />
    </el-icon>
    <file-share-create ref="fileShareCreateRef" />
  </div>
</template>

<style scoped lang="scss"></style>
