<template>
  <div>
    <div class="preview-title">代码示例</div>
    <pre class="preview-block user-select-none">
/**
 * 描述 ：{{ tableInfo?.codeComment }}
 *
 * @author : {{ tableInfo?.backEndAuthor }}
 **/
@Data
@Entity
public class {{ tableInfo?.codeName }}Entity implements Serializable {

    private static final long serialVersionUID = 1L;

}
    </pre>
  </div>
</template>

<script setup lang="ts">
import type { GenTableInfoResponse } from '@/service/model/generate/table.model'

const tableInfo = defineModel<GenTableInfoResponse>('tableInfo', {
  required: true,
  default: () => {},
})
</script>

<style lang="scss" scoped>
.preview-title {
  font-weight: 600;
  margin: 5px;
}

.preview-block {
  width: 100%;
  font-size: 14px;
  background: var(--el-bg-color-page);
}
</style>
