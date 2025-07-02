<template>
  <view class="scan-code-container">
    <wd-button
      :type="buttonType"
      :loading="isScanning"
      :disabled="isScanning"
      class="scan-button"
      @click="handleScan"
    >
      <wd-icon name="scan" size="20px" v-if="!isScanning" />
      {{ isScanning ? t('scanning') : t('scan_code') }}
    </wd-button>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ButtonType } from 'wot-design-uni/components/wd-button/types'

// 定义 props
interface Props {
  buttonType?: ButtonType
  onlyFromCamera?: boolean
  scanType?: Array<'barCode' | 'qrCode' | 'datamatrix' | 'pdf417'>
}

const props = withDefaults(defineProps<Props>(), {
  buttonType: 'primary',
  onlyFromCamera: true,
  scanType: () => ['barCode', 'qrCode'],
})

// 定义 emits
interface Emits {
  success: [result: UniApp.ScanCodeSuccessRes]
  fail: [error: any]
  cancel: []
}

const emit = defineEmits<Emits>()

const i18n = useI18n()
const t = i18n.t

const isScanning = ref(false)

// 处理扫码
const handleScan = async () => {
  try {
    isScanning.value = true

    const result = await uni.scanCode({
      onlyFromCamera: props.onlyFromCamera,
      scanType: props.scanType,
    })

    // 扫描成功，触发 success 事件
    emit('success', result)
  } catch (error: any) {
    // 处理不同的错误情况
    if (error.errMsg && error.errMsg.includes('cancel')) {
      // 用户取消扫描
      emit('cancel')
    } else {
      // 其他错误
      console.error('扫码失败:', error)
      emit('fail', error)

      // 显示错误提示
      uni.showToast({
        title: t('scan_failed'),
        icon: 'error',
        duration: 2000,
      })
    }
  } finally {
    isScanning.value = false
  }
}
</script>

<style lang="scss" scoped>
.scan-code-container {
  display: flex;
  justify-content: center;
  align-items: center;

  .scan-button {
    display: flex;
    align-items: center;
    gap: 8rpx;
    border-radius: 10rpx;
    min-width: 160rpx;
    height: 70rpx;
    font-size: 28rpx;
  }
}
</style>
