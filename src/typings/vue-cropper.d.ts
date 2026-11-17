/**
 * vue-cropper 1.1.4 类型补充声明
 *
 * 该包官方 typings 有缺陷：`lib/index.ts`（源码而非声明文件）引用了不存在的
 * `./vue-cropper.vue`，且 `package.json#typings` 指向它，根路径导入会直接报
 * TS7016（skipLibCheck 也兜不住）。故组件改用无类型副作用的深导入
 * `vue-cropper/dist/vue-cropper.es.js`（Vue 3 ESM 构建产物），并在此声明其导出；
 * 实例方法类型（裁剪/缩放/旋转/导出）在组件 `types.ts` 的 `XhtAvatarCropperMethods` 中。
 */
declare module 'vue-cropper/dist/vue-cropper.es.js' {
  import type { DefineComponent } from 'vue'

  export const VueCropper: DefineComponent<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>
}
