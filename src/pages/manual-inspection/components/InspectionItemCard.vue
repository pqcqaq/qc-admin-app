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
      <image v-else :src="localUrl || url" class="img-box" mode="aspectFill" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { uploadManualDetectionImage } from '@/api/manual-inspection'

defineProps<{
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
</script>

<style scoped>
.add-img-box {
  width: 84px;
  height: 64px;
  background: #fafafa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s;
}
.corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: #e0e0e0;
  border-style: solid;
}
.corner-tl {
  left: 0;
  top: 0;
  border-left-width: 2px;
  border-top-width: 2px;
  border-right-width: 0;
  border-bottom-width: 0;
}
.corner-tr {
  right: 0;
  top: 0;
  border-right-width: 2px;
  border-top-width: 2px;
  border-left-width: 0;
  border-bottom-width: 0;
}
.corner-bl {
  left: 0;
  bottom: 0;
  border-left-width: 2px;
  border-bottom-width: 2px;
  border-right-width: 0;
  border-top-width: 0;
}
.corner-br {
  right: 0;
  bottom: 0;
  border-right-width: 2px;
  border-bottom-width: 2px;
  border-left-width: 0;
  border-top-width: 0;
}
.add-img-box:hover {
  border-color: #bdbdbd;
}
.img-box {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
}
</style>
