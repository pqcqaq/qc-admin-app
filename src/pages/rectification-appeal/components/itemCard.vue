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
        <view class="btn-group" v-show="item.finishState !== 1">
          <button class="btn-appeal" size="mini" @click="$emit('appeal', item)">
            {{ t('appeal') }}
          </button>
          <button class="btn-rectify" size="mini" @click="$emit('rectify', item)">
            {{ t('rectify') }}
            <!-- 去整改 -->
          </button>
        </view>
      </view>
      <view class="img-wrapper">
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
        <image :src="item.detectionTask.detection.imageUrl" class="item-img" mode="aspectFill" />
        <!-- <image :src="'/static/app/icons/1024x1024.png'" class="item-img" mode="aspectFill" /> -->
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const t = i18n.t

defineProps<{ item: any }>()
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
</style>
