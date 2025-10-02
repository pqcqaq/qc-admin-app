# UploadFormItem 组件

基于 Wot-UI + Uni-app 的文件上传组件，适配原有的 Element Plus 版本。

## 功能特性

- 支持头像上传（avatar）和卡片式上传（card）两种模式
- 支持自动上传和手动上传
- 文件大小和类型验证
- 上传进度显示
- 错误处理和用户提示
- 响应式设计

## Props

| 参数        | 类型               | 默认值   | 说明                                                       |
| ----------- | ------------------ | -------- | ---------------------------------------------------------- |
| modelValue  | string \| string[] | -        | 双向绑定的值，单文件时为文件ID字符串，多文件时为文件ID数组 |
| type        | 'avatar' \| 'card' | 'avatar' | 上传组件类型                                               |
| limit       | number             | 1        | 文件数量限制                                               |
| placeholder | string             | -        | 占位符文本                                                 |
| tip         | string             | -        | 提示文本                                                   |
| url         | string             | -        | 回显URL（仅在limit=1时生效）                               |
| disabled    | boolean            | false    | 是否禁用                                                   |
| accept      | string             | -        | 接受的文件类型                                             |
| maxSize     | number             | 10       | 文件大小限制(MB)                                           |
| autoUpload  | boolean            | true     | 是否自动上传                                               |

## Events

| 事件名            | 参数                      | 说明           |
| ----------------- | ------------------------- | -------------- |
| update:modelValue | value: string \| string[] | 值变化时触发   |
| upload-success    | files: FileItem[]         | 上传成功时触发 |
| upload-error      | error: Error              | 上传失败时触发 |

## 使用示例

### 头像上传

```vue
<template>
  <UploadFormItem
    v-model="avatarId"
    type="avatar"
    :limit="1"
    :max-size="5"
    placeholder="点击上传头像"
    tip="支持jpg、png格式，文件大小不超过5MB"
    @upload-success="handleUploadSuccess"
    @upload-error="handleUploadError"
  />
</template>

<script setup>
import UploadFormItem from '@/components/upload/UploadFormItem.vue'

const avatarId = ref('')

const handleUploadSuccess = (files) => {
  console.log('上传成功:', files)
}

const handleUploadError = (error) => {
  console.error('上传失败:', error)
}
</script>
```

### 卡片式多文件上传

```vue
<template>
  <UploadFormItem
    v-model="fileIds"
    type="card"
    :limit="5"
    :max-size="10"
    placeholder="添加文件"
    tip="最多上传5个文件，单个文件不超过10MB"
    @upload-success="handleUploadSuccess"
  />
</template>

<script setup>
const fileIds = ref([])
</script>
```

## 注意事项

1. 组件依赖于 `qc-admin-api-common/attachment` 中的 `prepareUpload` 和 `confirmUpload` 接口
2. 组件使用 Wot-UI 的图标和加载组件
3. 在非自动上传模式下，文件会在组件销毁时自动上传
4. 支持图片预览和文件信息展示

## 样式说明

组件采用响应式设计，支持：

- 头像模式：圆形头像显示区域，200rpx × 200rpx
- 卡片模式：网格布局，每个卡片 200rpx × 200rpx
- 统一的颜色主题和交互效果

## API 接口

组件使用直接上传方式：

- 使用 `uni.uploadFile` 直接上传到 `/api/attachments/direct-upload` 接口
- 自动添加用户认证token到请求头
- 支持上传进度监控和错误处理

不再需要分段上传（prepareUpload -> 上传到存储 -> confirmUpload）的复杂流程。
