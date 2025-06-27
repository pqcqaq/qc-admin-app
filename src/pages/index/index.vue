<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
  layout: 'tabbar',
}
</route>
<template>
  <view class="page">
    <view class="page_header">
      <view class="page_header_user"></view>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Home',
})
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  &_header {
    padding: 20px;
    background: var(--color-primary);
  }
}
</style>
