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
      <view class="submit-button-container">
        <wd-button :type="buttonType" class="submit-button" @click="submitFeedback">
          {{ t('submit') }}
        </wd-button>
      </view>
      <view class="qr-code" @click="handleImageClick">
        <img :src="qrCode" />
      </view>
      <view class="font">
        <text>{{ t('scan_the_QR_code_to_add_our_WeChat_for_business') }}</text>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import MineBar from '@/components/mine-bar/MineBar.vue'
import { useI18n } from 'vue-i18n'
import { ButtonType } from 'wot-design-uni/components/wd-button/types'
import { addFeedback } from '@/api/feedback'

const i18n = useI18n()
const t = i18n.t

const buttonType = ref<ButtonType>('info') // 按钮类型

const feedback = ref('')

const qrCode = ref('/src/static/qrcode-qiyeweixin.png')

// 提交反馈
const submitFeedback = async () => {
  if (feedback.value.trim() === '') {
    uni.showToast({
      title: t('feedback_cannot_be_empty'),
      icon: 'error',
      duration: 2000,
      mask: true,
    })
    return
  }

  // 清空输入框
  feedback.value = ''

  return addFeedback({
    text: feedback.value,
  }).then((res) => {
    if (res.code === 0) {
      uni.showToast({
        title: t('feedback_submitted_successfully'),
        icon: 'success',
        duration: 2000,
      })
    } else {
      uni.showToast({
        title: t('feedback_submission_failed'),
        icon: 'error',
        duration: 2000,
      })
    }
  })
}

//按钮变色
const changeButtonColor = () => {
  if (feedback.value.trim() !== '') {
    buttonType.value = 'success' // 如果有内容，变为绿色
  } else {
    buttonType.value = 'info' // 如果没有内容，变为灰色
  }
}
watch(() => feedback.value, changeButtonColor)

//保存图片
const handleImageClick = () => {
  uni.showActionSheet({
    itemList: ['保存图片到相册'],
    success: (res) => {
      if (res.tapIndex === 0) {
        saveImage()
      }
    },
    fail: (err) => {
      console.error('操作取消', err)
    },
  })
}

const saveImage = () => {
  uni.downloadFile({
    url: '/src/static/qrcode-qiyeweixin.png',
    success: (res) => {
      if (res.statusCode === 200) {
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            uni.showToast({
              title: '保存成功',
              icon: 'success',
            })
          },
          fail: (err) => {
            if (err.errMsg.includes('auth deny') || err.errMsg.includes('authorize')) {
              // 引导用户授权
              uni.showModal({
                title: '提示',
                content: '需要授权保存到相册，是否前往设置？',
                success: (res) => {
                  if (res.confirm) {
                    uni.openSetting()
                  }
                },
              })
            } else {
              uni.showToast({
                title: '保存失败',
                icon: 'none',
              })
              console.error('保存失败', err)
            }
          },
        })
      }
    },
    fail: (err) => {
      uni.showToast({
        title: '下载失败',
        icon: 'none',
      })
      console.error('下载失败', err)
    },
  })
}
</script>
<style lang="scss" scoped>
$title-color: #536387;
$bg-color: #f5f5f5;
$font-color: #4d515b;
.container {
  .status-bar-title {
    font-size: large;
    font-weight: bold;
    color: $title-color;
  }
  .feedback-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 20rpx;
    background-color: $bg-color;

    .submit-button-container {
      display: flex;
      justify-content: center;
      .submit-button {
        margin-top: 50rpx;
        border-radius: 10rpx;
        width: 80%;
        height: 80rpx;
        font-size: 30rpx;
      }
    }

    .qr-code {
      display: flex;
      justify-content: center;
      margin-top: 80rpx;
    }

    .font {
      margin-top: 50rpx;
      display: flex;
      justify-content: center;
      font-size: large;
      color: $font-color;
    }
  }
}
::v-deep .page-content {
  padding: 0;
}
</style>
