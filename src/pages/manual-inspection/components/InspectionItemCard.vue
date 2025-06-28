<template>
  <view class="flex items-start p-4 bg-white rounded-2xl shadow mb-4">
    <view class="flex-1">
      <view class="font-bold text-base mb-1">{{ detectionRuleName }}</view>
      <view class="text-gray-500 text-sm leading-6">{{ detectionRuleRequire }}</view>
    </view>
    <view class="flex items-center justify-center ml-4">
      <view v-if="!(localUrl || url)" class="add-img-box" @click="onAdd">
        <span class="corner corner-tl"></span>
        <span class="corner corner-tr"></span>
        <span class="corner corner-bl"></span>
        <span class="corner corner-br"></span>
        <wd-icon name="add" size="32" color="#bdbdbd" />
      </view>
      <image v-else :src="localUrl || url" class="img-box" mode="aspectFill" @click="onPreview" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { uploadManualDetectionImage } from '@/api/manual-inspection'

const props = defineProps<{
  detectionRuleName: string
  detectionRuleRequire: string
  url?: string
  manualDetectionTaskId?: number
  detectionRuleId?: number
}>()
const emit = defineEmits(['add', 'update:url'])

const localUrl = ref('')

// 初始化和外部url同步
watch(
  () => [localUrl.value],
  () => {},
)

// 监听props.url变化
watch(
  () => [localUrl.value],
  () => {},
)

function onAdd() {
  uni.showActionSheet({
    itemList: ['拍照', '从手机相册中选择'],
    success: function (res) {
      let sourceType = res.tapIndex === 0 ? ['camera'] : ['album']
      uni.chooseImage({
        count: 1,
        sourceType,
        success: function (chooseImageRes) {
          const filePath = chooseImageRes.tempFilePaths[0]
          const fileObj = chooseImageRes.tempFiles ? chooseImageRes.tempFiles[0] : undefined
          uploadManualDetectionImage(filePath, fileObj).then((url) => {
            localUrl.value = url
            emit('update:url', url)
          })
        },
      })
    },
  })
}

function onPreview() {
  const previewUrl = localUrl.value || props.url
  if (previewUrl) {
    uni.previewImage({
      urls: [previewUrl],
      current: previewUrl,
    })
  }
}
</script>

<style scoped>
.add-img-box {
  width: 120rpx;
  height: 104rpx;
  background: #fafafa;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s;
}
.corner {
  position: absolute;
  width: 14rpx;
  height: 14rpx;
  border-color: #e0e0e0;
  border-style: solid;
}
.corner-tl {
  left: 0;
  top: 0;
  border-left-width: 2rpx;
  border-top-width: 2rpx;
  border-right-width: 0;
  border-bottom-width: 0;
}
.corner-tr {
  right: 0;
  top: 0;
  border-right-width: 2rpx;
  border-top-width: 2rpx;
  border-left-width: 0;
  border-bottom-width: 0;
}
.corner-bl {
  left: 0;
  bottom: 0;
  border-left-width: 2rpx;
  border-bottom-width: 2rpx;
  border-right-width: 0;
  border-top-width: 0;
}
.corner-br {
  right: 0;
  bottom: 0;
  border-right-width: 2rpx;
  border-bottom-width: 2rpx;
  border-left-width: 0;
  border-top-width: 0;
}
.add-img-box:hover {
  border-color: #bdbdbd;
}
.img-box {
  width: 120rpx;
  height: 104rpx;
  border-radius: 12rpx;
  object-fit: cover;
}
</style>
