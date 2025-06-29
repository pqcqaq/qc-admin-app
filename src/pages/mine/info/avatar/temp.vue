<template>
  <view>
    <button @click="takePhoto">拍照</button>
    <image v-if="imgUrl" :src="imgUrl" style="width: 200px; height: 200px" />
  </view>
</template>

<script setup>
import { ref } from 'vue'

const imgUrl = ref('')

function takePhoto() {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success(res) {
      imgUrl.value = res.tempFilePaths[0]
    },
  })
}
</script>
