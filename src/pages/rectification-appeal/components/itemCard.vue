<template>
  <view class="item-card">
    <view class="item-title">{{ item.detectionRule.type }}</view>

    <view class="item-content">
      <view class="item-left">
        <view class="item-desc-row">
          <text class="ai-label">{{ t('ai') }}</text>
          <text class="ai-label-text">{{ t('comment') }}</text>
          <text class="status-label">{{ t('unqualified') }}</text>
          <text class="desc-label">{{ item.detectionTask.detectionMessage }}</text>
        </view>
        <view class="btn-group" v-if="item.finishState !== 1">
          <button class="btn-appeal" size="mini" @click="$emit('appeal', item)">
            {{ t('appeal') }}
          </button>
          <button class="btn-rectify" size="mini" @click="$emit('rectify', item)">
            {{ t('rectify') }}
            <!-- 去整改 -->
          </button>
        </view>
      </view>
      <!-- 未完成时右侧图片 -->
      <view class="img-wrapper" v-if="item.finishState !== 1">
        <view class="tag-row">
          <wd-tag v-if="item.approveState === 2" type="danger" class="wd-status-tag">
            {{ t('audit_rejected') }}
          </wd-tag>
          <wd-tag v-if="item.appealState === 1" type="warning" class="wd-status-tag">
            {{ t('appeal_item') }}
          </wd-tag>
          <wd-tag v-if="item.approveState === 1" type="success" class="wd-status-tag">
            {{ t('rectification_passed') }}
          </wd-tag>
        </view>
        <image
          :src="item.detectionTask.detection.imageUrl"
          class="item-img"
          mode="aspectFill"
          @click="handlePreview(item.detectionTask.detection.imageUrl)"
        />
      </view>
    </view>

    <!-- 已完成时底部两张图片 -->
    <view v-if="item.finishState === 1" class="rectify-imgs flex justify-between items-center mt-4">
      <view class="flex-1 flex flex-col items-center">
        <image
          :src="item.detectionTask.detection.imageUrl"
          class="w-big h-big object-cover rounded-big mb-2"
          @click="handlePreview(item.detectionTask.detection.imageUrl)"
        />
        <text class="text-red-500 text-xs">整改前</text>
      </view>
      <view class="flex-1 flex flex-col items-center">
        <image
          :src="item.imageUrlList"
          class="w-big h-big object-cover rounded-big mb-2"
          @click="handlePreview(item.imageUrlList)"
        />
        <text class="text-teal-500 text-xs">整改后</text>
      </view>
    </view>
  </view>

  <!-- 新增：图片预览遮罩 -->
  <view v-if="showPreview" class="preview-mask" @click="closePreview">
    <image :src="previewImg" class="preview-img" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const t = i18n.t

defineProps<{ item: any }>()

// 新增：图片预览相关
const previewImg = ref('')
const showPreview = ref(false)
const handlePreview = (url: string) => {
  previewImg.value = url
  showPreview.value = true
}
const closePreview = () => {
  showPreview.value = false
}
</script>

<style scoped lang="scss">
.item-card {
  background: #fafbfc;
  border-radius: 36rpx;
  box-shadow: 0 3rpx 12rpx rgba(0, 0, 0, 0.03);
  padding: 21rpx 24rpx 21rpx 24rpx;
  margin-bottom: 27rpx;
}
.item-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: nowrap;
}
.item-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.item-title {
  font-weight: bold;
  font-size: 36rpx;
  color: #222;
  margin-bottom: 9rpx;
  line-height: 1.2;
}
.item-desc-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
  flex-wrap: wrap;
}
.ai-label {
  color: #3eab9a;
  font-weight: bold;
  font-size: 28rpx;
  margin-right: 3rpx;
}
.ai-label-text {
  color: #222;
  font-weight: bold;
  font-size: 28rpx;
  margin-right: 15rpx;
}
.status-label {
  color: #e53935;
  font-weight: bold;
  font-size: 28rpx;
  margin-right: 15rpx;
}
.desc-label {
  color: #5c5c5c;
  font-size: 24rpx;
  line-height: 1.6;
}
.btn-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 6rpx;
}
.btn-appeal {
  background: #f5f5f5;
  color: #666;
  font-size: 26rpx;
  width: 128rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 18rpx;
}
.btn-rectify {
  background: #3eab9a;
  color: #fff;
  font-size: 26rpx;
  width: 148rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
}
.tag-row {
  position: absolute;
  top: -42rpx;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 12rpx;
  z-index: 2;
}
.wd-status-tag {
  white-space: nowrap;
}
.item-img {
  width: 144rpx;
  height: 108rpx;
  border-radius: 18rpx;
  object-fit: cover;
  flex-shrink: 0;
  margin-left: 27rpx;
  margin-top: 3rpx;
  max-width: 144rpx;
  max-height: 108rpx;
}
.rectify-imgs {
  gap: 16rpx;
}
.w-24 {
  width: 96rpx;
}
.h-24 {
  height: 96rpx;
}
.object-cover {
  object-fit: cover;
}
.rounded {
  border-radius: 12rpx;
}
.mb-2 {
  margin-bottom: 8rpx;
}
.text-xs {
  font-size: 24rpx;
}
// 新增更大的图片样式
.w-big {
  width: 160rpx;
}
.h-big {
  height: 160rpx;
}
.rounded-big {
  border-radius: 20rpx;
}
.preview-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 12rpx;
  background: #fff;
}
</style>
