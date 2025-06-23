<template>
  <div>测试页</div>
  <!-- 跳转i18n测试 -->
  <button @click="handler">跳转i18n测试</button>
  <button @click="handlerMarkdown">跳转markdown测试</button>
</template>

<script setup lang="ts">
const handler = () => {
  uni.navigateTo({
    url: '/pages/about/i18n',
  })
}

const handlerMarkdown = () => {
  uni.navigateTo({
    url: '/pages/markdown-demo/index',
  })
}
</script>

<style scoped></style>
