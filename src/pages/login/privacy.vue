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
const t = i18n.t
</script>

<style lang="scss" scoped>
.markdown-demo {
  padding: 12px;
  background-color: #f5f5f5;
  min-height: 100vh;

  .header {
    text-align: center;
    margin-bottom: 16px;

    .title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
  }

  .demo-section {
    background-color: white;
    border-radius: 6px;
    margin-bottom: 12px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

    .section-title {
      background-color: #007aff;
      color: white;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
