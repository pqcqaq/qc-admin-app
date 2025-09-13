<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="container">
    <MineBar>
      <template #title>
        <text class="status-bar-title">{{ t('help_and_feedback') }}</text>
      </template>
    </MineBar>
    <view class="feedback-container">
      <view>
        <wd-textarea
          v-model="feedback"
          :placeholder="t('please_enter_your_opinions_and_suggestions')"
          :maxlength="500"
          show-word-limit
        />
      </view>
      <view class="feedback-button-container">
        <!-- <button class="feedback-submit" @click="submitFeedback">
          {{ t('submit') }}
        </button> -->
      </view>
      <!-- <view class="qr-code" @click="handleImageClick">
        <image :src="qrCode" class="qr-code-image" />
      </view> -->
      <view class="font">
        <text>{{ t('scan_the_QR_code_to_add_our_WeChat_for_business') }}</text>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import MineBar from '@/components/mine-bar/MineBar.vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const t = i18n.t

const feedback = ref('')

const qrCode = ref('/static/qrcode-qiyeweixin.png')

// // 提交反馈
// const submitFeedback = async () => {
//   if (feedback.value.trim() === '') {
//     uni.showToast({
//       title: t('feedback_cannot_be_empty'),
//       icon: 'error',
//       duration: 2000,
//       mask: true,
//     })
//     return
//   }

//   // 清空输入框
//   feedback.value = ''

//   return addFeedback({
//     text: feedback.value,
//   }).then((res) => {
//     if (res.code === 0) {
//       uni.showToast({
//         title: t('feedback_submitted_successfully'),
//         icon: 'success',
//         duration: 2000,
//       })
//     } else {
//       uni.showToast({
//         title: t('feedback_submission_failed'),
//         icon: 'error',
//         duration: 2000,
//       })
//     }
//   })
// }

// //保存图片
// const handleImageClick = () => {
//   uni.showActionSheet({
//     itemList: [t('save_the_picture_to_the_album')],
//     success: (res) => {
//       if (res.tapIndex === 0) {
//         saveImage()
//       }
//     },
//     fail: (err) => {
//       console.error('操作取消', err)
//     },
//   })
// }

// const saveImage = () => {
//   uni.downloadFile({
//     url: '/static/qrcode-qiyeweixin.png',
//     success: (res) => {
//       if (res.statusCode === 200) {
//         uni.saveImageToPhotosAlbum({
//           filePath: res.tempFilePath,
//           success: () => {
//             uni.showToast({
//               title: t('save_successfully'),
//               icon: 'success',
//             })
//           },
//           fail: (err) => {
//             if (err.errMsg.includes('auth deny') || err.errMsg.includes('authorize')) {
//               // 引导用户授权
//               uni.showModal({
//                 title: t('tip'),
//                 content: t('please_authorize_save_to_album'),
//                 success: (res) => {
//                   if (res.confirm) {
//                     uni.openSetting()
//                   }
//                 },
//               })
//             } else {
//               uni.showToast({
//                 title: t('save_failed'),
//                 icon: 'none',
//               })
//               console.error('保存失败', err)
//             }
//           },
//         })
//       }
//     },
//     fail: (err) => {
//       uni.showToast({
//         title: t('save_failed'),
//         icon: 'none',
//       })
//       console.error(t('save_failed'), err)
//     },
//   })
// }
</script>
<style lang="scss" scoped>
@import '@/style/variables.scss';

.container {
  height: 100%;
  background-color: $bg-primary;
}

.status-bar-title {
  font-size: large;
  font-weight: bold;
  color: $font-secondary;
}

.feedback-container {
  display: flex;
  flex-direction: column;
  padding: 20rpx;
}

.feedback-button-container {
  margin-top: 80rpx;
  display: flex;
  justify-content: center;
  padding: 0 20rpx;
}

.qr-code {
  display: flex;
  justify-content: center;
  margin-top: 80rpx;
}

.qr-code-image {
  width: 400rpx;
  height: 400rpx;
}

.font {
  margin-top: 50rpx;
  display: flex;
  justify-content: center;
  font-size: large;
  color: $font-tertiary;
}

.feedback-submit {
  width: 100%;
  height: 80rpx;
  border-radius: 10rpx;
  font-size: 30rpx;
  background-color: #3daa9a;
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:active {
  background-color: #359a8a;
}

::v-deep .page-content {
  padding: 0;
}
</style>
