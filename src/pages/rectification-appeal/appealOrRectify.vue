<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '每日AI早检',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view>
    <!-- 顶部自定义导航栏 -->
    <view class="bg-teal-500 pt-8 pb-10 px-4 relative">
      <view class="flex items-center">
        <view class="w-8 flex items-center justify-start">
          <wd-icon name="arrow-left" color="#fff" size="24" @click="onBack" />
        </view>
        <view class="flex-1 text-center text-white text-lg font-bold">
          {{ t('daily_ai_early_inspection') }}
        </view>
        <view class="w-8"></view>
      </view>
      <view class="flex justify-center items-center mt-2 text-white text-sm">
        <view class="flex items-center">
          <wd-icon name="calendar" size="16" class="mr-1" />
          <text>2025年6月9日</text>
        </view>
        <view class="mx-4"></view>
        <view class="flex items-center">
          <wd-icon name="shop" size="16" class="mr-1" />
          <text>黄龙体育中心店</text>
        </view>
      </view>
    </view>

    <!-- 检查项进度区，悬浮在绿色区域下方 -->
    <view class="relative z-10">
      <view class="mt-[-32px]">
        <view class="flex items-center px-6 py-4 bg-white rounded-t-3xl shadow">
          <wd-icon name="bulletpoint" size="24" class="mr-3" />
          <text class="text-gray-700 text-base mr-3">{{ t('inspection_item') }}</text>
          <wd-progress
            :percentage="progressPercent"
            color="#26b7a7"
            track-color="#e5e5e5"
            class="flex-1 mx-4"
            height="16"
            show-info="false"
            hide-text
          />
          <text class="text-gray-500 text-base ml-3">{{ checkedCount }}/{{ totalCount }}</text>
        </view>
      </view>
    </view>

    <!-- 申诉/整改卡片和表单区 -->
    <view class="appeal-rectify-page">
      <!-- 顶部卡片内容 -->
      <view class="item-card">
        <view class="item-title">{{ item.detectionRule?.type }}</view>
        <view class="item-content">
          <view class="item-left">
            <view class="item-desc-row">
              <text class="ai-label">{{ t('ai') }}</text>
              <text class="ai-label-text">{{ t('comment') }}</text>
              <text class="status-label">{{ t('unqualified') }}</text>
              <text class="desc-label">{{ item.detectionTask?.detectionMessage || '' }}</text>
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
            <image
              :src="item.detectionTask?.detectionImageUrl"
              class="item-img"
              mode="aspectFill"
            />
          </view>
        </view>
      </view>

      <!-- 说明表单区 -->
      <view class="form-title-row">
        <view class="form-title">
          {{ isAppeal ? t('appeal_description') : t('rectification_description') }}
        </view>
        <wd-icon name="user" size="22px" />
      </view>
      <view class="form-section">
        <textarea
          v-model="text"
          class="desc-textarea"
          :placeholder="t('please_enter_description')"
        />
        <view class="form-title mt-4">{{ t('upload_photo') }}：</view>
        <view class="img-upload-placeholder">
          <template v-if="imageUrlList">
            <view class="img-uploaded-wrapper">
              <image
                :src="imageUrlList"
                class="img-uploaded"
                mode="aspectFill"
                @click="onPreview"
              />
              <view class="img-delete-btn" @click.stop="onDeleteImage">×</view>
            </view>
          </template>
          <template v-else>
            <view class="img-upload-btn" @click="onChooseImage">+</view>
          </template>
          <!-- <text class="img-upload-tip">（点击+上传，已上传可点击预览，右上角×可删除）</text> -->
        </view>
      </view>

      <!-- 提交按钮 -->
      <view
        class="submit-btn"
        :class="{ 'submit-btn--disabled': !canSubmit }"
        :disabled="!canSubmit"
        @click="onSubmit"
      >
        {{ t('submit') }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'
import { useRectificationAppealStore } from '@/store/rectificationAppeal'
import { uploadManualDetectionImage } from '@/api/manual-inspection'
import { updatedetectiontaskrectifieddetail } from '@/api/rectification-appeal'

const i18n = useI18n()
const t = i18n.t

const store = useRectificationAppealStore()
const item = computed(() => store.item)
const totalCount = computed(() => store.totalCount)
const checkedCount = computed(() => store.checkedCount)
const progressPercent = computed(() => (checkedCount.value / (totalCount.value || 1)) * 100)
const isAppeal = ref(false)
const text = ref('')
const imageUrlList = ref('')
const detectionTaskRectifiedDetailId = ref(0)

// 提交按钮可用性判断
const canSubmit = computed(() => {
  return text.value.trim().length > 0 && imageUrlList.value.trim().length > 0
})

function onBack() {
  uni.navigateBack()
}

onLoad((options) => {
  isAppeal.value = String(options.appealState) === '1'
  detectionTaskRectifiedDetailId.value = options.id
})

async function onSubmit() {
  if (!canSubmit.value) return
  const lastDetailFlag = totalCount.value - checkedCount.value === 1 ? true : false
  const data = {
    detectionTaskRectifiedDetailId: Number(detectionTaskRectifiedDetailId.value),
    text: text.value,
    imageUrl: imageUrlList.value,
    appealState: isAppeal.value ? 1 : 0,
    lastDetailFlag: lastDetailFlag,
  }
  const res = await updatedetectiontaskrectifieddetail(data)
  if (res.code === 0) {
    uni.showToast({ title: '提交成功', icon: 'success' })
    uni.navigateBack()
  } else {
    uni.showToast({ title: '提交失败', icon: 'none' })
  }
}

function onChooseImage() {
  uni.showActionSheet({
    itemList: ['拍照', '从手机相册中选择'],
    success: function (res) {
      let sourceType = res.tapIndex === 0 ? ['camera'] : ['album']
      uni.chooseImage({
        count: 1,
        sourceType,
        success: async function (chooseImageRes) {
          const filePath = chooseImageRes.tempFilePaths[0]
          const fileObj = chooseImageRes.tempFiles ? chooseImageRes.tempFiles[0] : undefined
          uploadManualDetectionImage(filePath, fileObj).then((url) => {
            imageUrlList.value = url
          })
        },
      })
    },
  })
}

function onPreview() {
  if (imageUrlList.value) {
    uni.previewImage({
      urls: [imageUrlList.value],
      current: imageUrlList.value,
    })
  }
}

function onDeleteImage() {
  imageUrlList.value = ''
}
</script>

<style scoped lang="scss">
.bg-teal-500 {
  background-color: rgb(62, 171, 154);
}
.rounded-b-3xl {
  border-bottom-left-radius: 36rpx;
  border-bottom-right-radius: 36rpx;
}
.appeal-rectify-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 0 0 48rpx 0;
}
.item-card {
  background: #fafbfc;
  border-radius: 36rpx;
  box-shadow: 0 3rpx 12rpx rgba(0, 0, 0, 0.03);
  padding: 21rpx 24rpx 21rpx 24rpx;
  margin: 27rpx 24rpx 0 24rpx;
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
.img-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
}
.tag-row {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
  margin-bottom: 12rpx;
  z-index: 2;
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
.form-section {
  background: #fff;
  border-radius: 18rpx;
  margin: 27rpx 24rpx 0 24rpx;
  padding: 27rpx 24rpx 27rpx 24rpx;
  box-shadow: 0 3rpx 12rpx rgba(0, 0, 0, 0.02);
}
.form-title-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 24rpx;
  margin-right: 24rpx;
}
.form-title {
  font-size: 26rpx;
  font-weight: 500;
  color: #222;
}
.desc-textarea {
  width: 100%;
  min-height: 120rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 15rpx;
  padding: 15rpx;
  font-size: 24rpx;
  color: #333;
  background: #fafbfc;
  resize: none;
}
.img-upload-placeholder {
  display: flex;
  align-items: center;
  margin-top: 12rpx;
}
.img-upload-btn {
  width: 120rpx;
  height: 105rpx;
  background: #f5f5f5;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 54rpx;
  color: #bbb;
  margin-right: 18rpx;
  border: 1rpx dashed #d0d0d0;
}
.img-upload-tip {
  color: #aaa;
  font-size: 20rpx;
}
.submit-btn {
  width: calc(100% - 48rpx);
  margin: 48rpx 24rpx 0 24rpx;
  background: #3eab9a;
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
  text-align: center;
  border-radius: 18rpx;
  padding: 18rpx 0;
  box-shadow: 0 3rpx 12rpx rgba(62, 171, 154, 0.08);
  cursor: pointer;
}
.submit-btn--disabled {
  background: #f5f6fa !important;
  color: #bcbcbc !important;
  border: 1rpx solid #e0e0e0 !important;
  cursor: not-allowed;
  pointer-events: none;
}
.img-uploaded-wrapper {
  position: relative;
  display: inline-block;
}
.img-uploaded {
  width: 96rpx;
  height: 96rpx;
  border-radius: 18rpx;
  object-fit: cover;
  margin-right: 18rpx;
  border: 1rpx solid #d0d0d0;
}
.img-delete-btn {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  width: 30rpx;
  height: 30rpx;
  background: #e53935;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 3rpx 12rpx rgba(229, 57, 53, 0.15);
}
</style>
