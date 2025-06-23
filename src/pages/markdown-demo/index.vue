<template>
  <view class="markdown-demo">
    <view class="header">
      <text class="title">Markdown渲染器演示</text>
    </view>

    <view class="demo-section">
      <view class="section-title">示例文档</view>
      <MarkdownRenderer src="example.md" />
    </view>

    <view class="demo-section">
      <view class="section-title">加载失败示例</view>
      <MarkdownRenderer src="non-existent.md" />
    </view>
  </view>
</template>

<script setup lang="ts">
import MarkdownRenderer from '@/components/markdown-renderer/MarkdownRenderer.vue'
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
