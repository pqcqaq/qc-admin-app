<template>
  <view class="upload-form-item" :class="[`upload-${type}`, { 'upload-single': limit === 1 }]">
    <!-- 圆形头像上传 -->
    <view v-if="type === 'avatar'" class="avatar-upload">
      <view class="avatar-wrapper" :class="{ 'is-disabled': disabled }" @click="handleUploadClick">
        <image v-if="displayUrl" :src="displayUrl" class="avatar-image" mode="aspectFill" />
        <view v-else class="avatar-placeholder">
          <wd-icon name="add-circle" size="48rpx" color="#c0c4cc" />
          <text class="placeholder-text">{{ uploadButtonText }}</text>
        </view>
        <view v-if="isUploading" class="avatar-loading">
          <wd-loading type="ring" size="24rpx" />
          <text class="loading-text">{{ uploadProgress }}%</text>
        </view>
      </view>
    </view>

    <!-- 卡片式上传 -->
    <view v-else-if="type === 'card'" class="card-upload">
      <view class="upload-grid">
        <!-- 已上传的文件 -->
        <view v-for="(file, index) in uploadedFiles" :key="index" class="upload-card file-card">
          <image
            v-if="file.url && isImage(file.name)"
            :src="file.url"
            class="card-image"
            mode="aspectFill"
          />
          <view v-else class="card-file">
            <wd-icon name="document" size="32rpx" color="#409eff" />
            <text class="file-name">{{ file.name }}</text>
          </view>

          <!-- 上传进度 -->
          <view v-if="file.uploading" class="card-loading">
            <wd-loading type="ring" size="16rpx" />
            <text class="progress-text">{{ file.progress }}%</text>
          </view>

          <!-- 删除按钮 -->
          <view
            v-if="!disabled && !file.uploading"
            class="card-remove"
            @click="removeUploadedFile(index)"
          >
            <wd-icon name="close" size="16rpx" color="#fff" />
          </view>
        </view>

        <!-- 上传触发器 -->
        <view v-if="showUploadButton" class="upload-card upload-trigger" @click="handleUploadClick">
          <wd-icon name="add" size="32rpx" color="#c0c4cc" />
          <text class="trigger-text">{{ uploadButtonText }}</text>
        </view>
      </view>
    </view>

    <!-- 提示文本 -->
    <view v-if="tipText" class="upload-tip">
      <text>{{ tipText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/store'

// 定义组件类型
type UploadType = 'avatar' | 'card'

// 定义文件接口
interface FileItem {
  id?: string
  name: string
  url?: string
  size?: number
  uploading?: boolean
  progress?: number
  raw?: File
}

// Props 定义
const props = withDefaults(
  defineProps<{
    /** 双向绑定的值 - 单文件时为文件ID字符串，多文件时为文件ID数组 */
    modelValue?: string | string[]
    /** 上传组件类型 */
    type?: UploadType
    /** 文件数量限制 */
    limit?: number
    /** 占位符文本 */
    placeholder?: string
    /** 提示文本 */
    tip?: string
    /** 回显URL - 仅在limit=1时生效 */
    url?: string
    /** 是否禁用 */
    disabled?: boolean
    /** 接受的文件类型 */
    accept?: string
    /** 文件大小限制(MB) */
    maxSize?: number
    /** 是否自动上传 */
    autoUpload?: boolean
  }>(),
  {
    type: 'avatar',
    limit: 1,
    maxSize: 10,
    autoUpload: true,
  },
)

// Emits 定义
const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
  'upload-success': [files: FileItem[]]
  'upload-error': [error: Error]
}>()

// Refs
const uploadedFiles = ref<FileItem[]>([])
const pendingFiles = ref<FileItem[]>([]) // 待上传文件列表（用于非自动上传模式）

// 用户Store
const userStore = useUserStore()

// 计算属性
const tipText = computed(() => {
  if (props.tip) return props.tip
  const sizeText = `文件大小不超过${props.maxSize}MB`
  const limitText = props.limit === 1 ? '只能上传1个文件' : `最多上传${props.limit}个文件`
  const uploadModeText = props.autoUpload ? '' : '，文件将在组件销毁时自动上传'
  return `${limitText}，${sizeText}${uploadModeText}`
})

const showUploadButton = computed(() => {
  if (props.disabled) return false
  return uploadedFiles.value.length < props.limit
})

const uploadButtonText = computed(() => {
  return props.placeholder || (props.limit === 1 ? '上传文件' : '添加文件')
})

// 显示的URL（优先使用回显URL）
const displayUrl = computed(() => {
  return uploadedFiles.value[0]?.url || props.url
})

// 是否正在上传
const isUploading = ref(false)

// 上传进度
const uploadProgress = ref(0)

// 文件类型判断
const isImage = (filename: string) => {
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'))
  return imageExts.includes(ext)
}

// 文件大小检查
const checkFileSize = (size: number) => {
  const sizeInMB = size / 1024 / 1024
  if (sizeInMB > props.maxSize) {
    uni.showToast({
      title: `文件大小不能超过${props.maxSize}MB`,
      icon: 'none',
    })
    return false
  }
  return true
}

// 处理上传点击
const handleUploadClick = () => {
  if (props.disabled || isUploading.value) return

  // 检查文件数量限制
  if (uploadedFiles.value.length >= props.limit) {
    uni.showToast({
      title: `最多只能上传${props.limit}个文件`,
      icon: 'none',
    })
    return
  }

  // 选择文件
  uni.chooseImage({
    count: props.limit - uploadedFiles.value.length,
    sourceType: ['camera', 'album'],
    success: (res) => {
      const files = res.tempFiles || []
      const filePaths = res.tempFilePaths || []

      // 确保files是数组
      const fileArray = Array.isArray(files) ? files : [files]

      for (let i = 0; i < fileArray.length && i < filePaths.length; i++) {
        const file = fileArray[i]
        const filePath = filePaths[i]

        // 检查文件大小
        if (!checkFileSize(file.size)) {
          continue
        }

        if (props.autoUpload) {
          // 自动上传模式：立即上传
          uploadFile(filePath, file)
        } else {
          // 非自动上传模式：添加到待上传列表
          const fileItem: FileItem = {
            name: `image_${Date.now()}_${i}.jpg`,
            size: file.size,
            uploading: false,
            progress: 0,
          }

          // 为图片文件创建本地预览URL
          fileItem.url = filePath

          if (props.limit === 1) {
            uploadedFiles.value = [fileItem]
            pendingFiles.value = [fileItem]
          } else {
            uploadedFiles.value.push(fileItem)
            pendingFiles.value.push(fileItem)
          }
        }
      }
    },
    fail: (err) => {
      console.error('选择文件失败:', err)
      uni.showToast({
        title: '选择文件失败',
        icon: 'none',
      })
    },
  })
}

// 上传文件
const uploadFile = async (filePath: string, file: any) => {
  // 设置上传状态
  isUploading.value = true
  uploadProgress.value = 0

  const fileItem: FileItem = {
    name: `image_${Date.now()}.jpg`,
    size: file.size,
    uploading: true,
    progress: 0,
    url: filePath, // 使用本地路径作为预览
  }

  // 更新UI状态
  if (props.limit === 1) {
    uploadedFiles.value = [fileItem]
  } else {
    uploadedFiles.value.push(fileItem)
  }

  try {
    // 直接使用 uni.uploadFile 上传到后端
    const uploadResult = await uploadToBackend(filePath, (progress) => {
      fileItem.progress = progress
      uploadProgress.value = progress
    })

    // 更新文件信息
    fileItem.id = uploadResult.id
    fileItem.url = uploadResult.url
    fileItem.progress = 100

    // 更新modelValue
    updateModelValue()

    uni.showToast({
      title: '文件上传成功',
      icon: 'success',
    })
    emit('upload-success', [fileItem])
  } catch (error: any) {
    console.error('文件上传失败:', error)
    uni.showToast({
      title: `上传失败: ${error.message || '未知错误'}`,
      icon: 'none',
    })

    // 移除失败的文件
    if (props.limit === 1) {
      uploadedFiles.value = []
    } else {
      const index = uploadedFiles.value.indexOf(fileItem)
      if (index > -1) {
        uploadedFiles.value.splice(index, 1)
      }
    }

    emit('upload-error', error)
  } finally {
    fileItem.uploading = false
    // 检查是否还有其他文件在上传中
    const hasUploadingFiles = uploadedFiles.value.some((f) => f.uploading)
    if (!hasUploadingFiles) {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }
}

// 批量上传待上传文件（用于非自动上传模式）
const uploadPendingFiles = async () => {
  if (pendingFiles.value.length === 0) {
    return
  }

  isUploading.value = true
  console.log(`开始上传 ${pendingFiles.value.length} 个待上传文件`)

  const filesToUpload = [...pendingFiles.value]
  const successFiles: FileItem[] = []

  for (const fileItem of filesToUpload) {
    if (!fileItem.url) continue

    try {
      // 更新上传状态
      fileItem.uploading = true
      fileItem.progress = 0

      // 直接上传到后端
      const uploadResult = await uploadToBackend(fileItem.url, (progress) => {
        fileItem.progress = progress
      })

      // 更新文件信息
      fileItem.id = uploadResult.id
      fileItem.url = uploadResult.url
      fileItem.progress = 100
      fileItem.uploading = false

      successFiles.push(fileItem)
      console.log(`文件 ${fileItem.name} 上传成功`)
    } catch (error: any) {
      console.error(`文件 ${fileItem.name} 上传失败:`, error)
      fileItem.uploading = false
      fileItem.progress = 0
    }
  }

  // 清空待上传列表
  pendingFiles.value = []

  // 更新modelValue
  updateModelValue()

  if (successFiles.length > 0) {
    console.log(`批量上传完成，成功上传 ${successFiles.length} 个文件`)
    emit('upload-success', successFiles)
  }

  isUploading.value = false
}

// 直接上传到后端
const uploadToBackend = (filePath: string, onProgress: (progress: number) => void) => {
  return new Promise<{ id: string; url: string }>((resolve, reject) => {
    userStore.checkAccessToken().then((canupload) => {
      if (!canupload) {
        reject(new Error('无法上传文件，请重新登录'))
        return
      }

      const uploadTask = uni.uploadFile({
        url: `/api/attachments/direct-upload`,
        filePath: filePath,
        name: 'file',
        formData: {
          // 这里可以添加额外的表单字段
        },
        header: {
          // 添加认证token
          ...(userStore.token && { Authorization: `Bearer ${userStore.token.accessToken}` }),
        },
        success: (res) => {
          try {
            if (res.statusCode === 200) {
              const responseData = JSON.parse(res.data)
              if (responseData.success) {
                onProgress(100)
                // 根据实际响应结构，数据在 attachment 字段中
                const attachment = responseData.attachment || responseData.data
                resolve({
                  id: attachment.id,
                  url: attachment.url,
                })
              } else {
                reject(new Error(responseData.message || responseData.data || '上传失败'))
              }
            } else {
              reject(new Error(`上传失败，状态码: ${res.statusCode}`))
            }
          } catch (error) {
            console.error('解析响应失败:', error, 'res.data:', res.data)
            reject(new Error('解析服务器响应失败'))
          }
        },
        fail: (err) => {
          reject(new Error(`网络错误，上传失败: ${err.errMsg}`))
        },
      })

      // 监听上传进度
      uploadTask.onProgressUpdate((res) => {
        onProgress(res.progress)
      })
    })
  })
}

// 更新modelValue
const updateModelValue = () => {
  if (props.limit === 1) {
    const fileId = uploadedFiles.value[0]?.id || ''
    emit('update:modelValue', fileId)
  } else {
    const fileIds = uploadedFiles.value.filter((f) => f.id).map((f) => f.id) as string[]
    emit('update:modelValue', fileIds)
  }
}

// 移除已上传文件
const removeUploadedFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
  updateModelValue()
}

// 清除文件
const clearFiles = () => {
  uploadedFiles.value = []
  pendingFiles.value = []
  updateModelValue()
}

// 组件销毁前上传待上传的文件
onBeforeUnmount(async () => {
  if (!props.autoUpload && pendingFiles.value.length > 0) {
    console.log('组件即将销毁，开始上传待上传文件')
    await uploadPendingFiles()
  }
})

// 暴露方法
defineExpose({
  clearFiles,
  uploadPendingFiles,
})
</script>

<style lang="scss" scoped>
@import '@/style/variables.scss';

.upload-form-item {
  width: 100%;

  &.upload-single {
    .file-list {
      max-height: none;
    }
  }
}

// 头像上传样式
.avatar-upload {
  display: flex;
  justify-content: center;

  .avatar-wrapper {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    border: 4rpx dashed $border-light;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: $bg-light-gray;

    &:hover {
      border-color: $color-info;
    }

    &.is-disabled {
      opacity: $opacity-disabled;
      cursor: not-allowed;
    }

    .avatar-image {
      width: 100%;
      height: 100%;
    }

    .avatar-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .placeholder-text {
        margin-top: 16rpx;
        font-size: $font-size-sm;
        color: $font-disabled;
      }
    }

    .avatar-loading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      .loading-text {
        margin-top: 16rpx;
        font-size: $font-size-sm;
        color: $color-info;
      }
    }
  }
}

// 卡片上传样式
.card-upload {
  .upload-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 24rpx;
  }

  .upload-card {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    border: 2rpx solid $border-light;
    border-radius: $radius-base;
    overflow: hidden;

    &.file-card {
      .card-image {
        width: 100%;
        height: 100%;
      }

      .card-file {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: #fafafa;

        .file-name {
          margin-top: 16rpx;
          font-size: 20rpx;
          color: #606266;
          text-align: center;
          padding: 0 8rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }
      }

      .card-loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .progress-text {
          margin-top: 16rpx;
          font-size: 24rpx;
          color: #409eff;
        }
      }

      .card-remove {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        width: 32rpx;
        height: 32rpx;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &.upload-trigger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #fafafa;
      border-style: dashed;

      &:hover {
        border-color: #409eff;
        background-color: #f0f9ff;
      }

      .trigger-text {
        margin-top: 16rpx;
        font-size: 24rpx;
        color: #909399;
      }
    }
  }
}

// 提示文本样式
.upload-tip {
  margin-top: 16rpx;

  text {
    font-size: 24rpx;
    color: #909399;
    line-height: 1.4;
  }
}
</style>
