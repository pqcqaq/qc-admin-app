<route lang="json5">
{
  style: {
    navigationBarTitleText: '请仔细阅读',
  },
}
</route>
<template>
  <view class="markdown-demo">
    <view class="header"></view>

    <view class="demo-section">
      <view class="section-title">{{ t('privacy_policy') }}</view>
      <MarkdownRenderer src="privacy.md" />
    </view>
  </view>
</template>

<script setup lang="ts">
import MarkdownRenderer from '@/components/markdown-renderer/MarkdownRenderer.vue'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()
const { t } = i18n
</script>

<style lang="scss" scoped>
@import '@/style/variables.scss';

.markdown-demo {
  padding: 12px;
  background-color: $bg-primary;

  .header {
    text-align: center;
    margin-bottom: 16px;

    .title {
      font-size: 20px;
      font-weight: bold;
      color: $font-primary;
    }
  }

  .demo-section {
    background-color: $bg-white;
    border-radius: 6px;
    margin-bottom: 12px;
    overflow: hidden;
    box-shadow: $shadow-light;

    .section-title {
      background-color: $color-info;
      color: $bg-white;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
