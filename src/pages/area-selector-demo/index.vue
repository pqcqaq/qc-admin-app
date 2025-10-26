<route lang="json5">
{
  layout: 'default',
  needLogin: true,
}
</route>

<template>
  <view class="area-selector-demo">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">地理位置选择组件测试</text>
    </view>

    <!-- 测试案例 -->
    <view class="demo-section">
      <view class="section-title">基础用法</view>
      <view class="demo-item">
        <AreaSelector
          v-model="selectedArea1"
          v-model:current="currentArea1"
          placeholder="请选择省市区"
          @change="handleChange1"
        />
        <view class="result-text">
          <text class="label">选中ID数组:</text>
          <text class="value">{{ JSON.stringify(selectedArea1) }}</text>
        </view>
        <view class="result-text">
          <text class="label">当前ID:</text>
          <text class="value">{{ currentArea1 || '未选择' }}</text>
        </view>
      </view>
    </view>

    <view class="demo-section">
      <view class="section-title">限制选择级别(最多选到市级)</view>
      <view class="demo-item">
        <AreaSelector
          v-model="selectedArea2"
          v-model:current="currentArea2"
          :max-level="3"
          placeholder="最多选到市级"
          @change="handleChange2"
        />
        <view class="result-text">
          <text class="label">选中ID数组:</text>
          <text class="value">{{ JSON.stringify(selectedArea2) }}</text>
        </view>
        <view class="result-text">
          <text class="label">当前ID:</text>
          <text class="value">{{ currentArea2 || '未选择' }}</text>
        </view>
      </view>
    </view>

    <view class="demo-section">
      <view class="section-title">允许选择任意级别</view>
      <view class="demo-item">
        <AreaSelector
          v-model="selectedArea3"
          v-model:current="currentArea3"
          :check-strictly="true"
          placeholder="可选择任意级别"
          @change="handleChange3"
        />
        <view class="result-text">
          <text class="label">选中ID数组:</text>
          <text class="value">{{ JSON.stringify(selectedArea3) }}</text>
        </view>
        <view class="result-text">
          <text class="label">当前ID:</text>
          <text class="value">{{ currentArea3 || '未选择' }}</text>
        </view>
      </view>
    </view>

    <view class="demo-section">
      <view class="section-title">禁用状态</view>
      <view class="demo-item">
        <AreaSelector
          v-model="selectedArea4"
          v-model:current="currentArea4"
          :disabled="true"
          placeholder="禁用状态"
        />
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="action-btn reset-btn" @click="handleReset">重置所有选择</button>
      <button class="action-btn" @click="handleShowResult">查看所有结果</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AreaSelector from '@/components/area-selector/AreaSelector.vue'

// 基础用法
const selectedArea1 = ref<string[]>([])
const currentArea1 = ref<string>('')

// 限制级别
const selectedArea2 = ref<string[]>([])
const currentArea2 = ref<string>('')

// 任意级别
const selectedArea3 = ref<string[]>([])
const currentArea3 = ref<string>('')

// 禁用状态
const selectedArea4 = ref<string[]>(['110000', '110100', '110101'])
const currentArea4 = ref<string>('110101')

// 处理选择变化
const handleChange1 = (ids: string[], currentId: string) => {
  console.log('基础用法 - 选中:', ids, currentId)
  uni.showToast({
    title: `已选择: ${ids.length} 级`,
    icon: 'none',
  })
}

const handleChange2 = (ids: string[], currentId: string) => {
  console.log('限制级别 - 选中:', ids, currentId)
}

const handleChange3 = (ids: string[], currentId: string) => {
  console.log('任意级别 - 选中:', ids, currentId)
}

// 重置所有选择
const handleReset = () => {
  selectedArea1.value = []
  currentArea1.value = ''
  selectedArea2.value = []
  currentArea2.value = ''
  selectedArea3.value = []
  currentArea3.value = ''

  uni.showToast({
    title: '已重置',
    icon: 'success',
  })
}

// 查看所有结果
const handleShowResult = () => {
  const result = {
    基础用法: {
      ids: selectedArea1.value,
      current: currentArea1.value,
    },
    限制级别: {
      ids: selectedArea2.value,
      current: currentArea2.value,
    },
    任意级别: {
      ids: selectedArea3.value,
      current: currentArea3.value,
    },
    禁用状态: {
      ids: selectedArea4.value,
      current: currentArea4.value,
    },
  }

  console.log('所有结果:', result)
  uni.showModal({
    title: '所有选择结果',
    content: JSON.stringify(result, null, 2),
    showCancel: false,
  })
}
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';

.area-selector-demo {
  min-height: 100vh;
  background: $bg-gray;
  padding: 20rpx;
}

.page-header {
  padding: 40rpx 20rpx;
  text-align: center;

  .page-title {
    font-size: 36rpx;
    font-weight: bold;
    color: $font-primary;
  }
}

.demo-section {
  margin-bottom: 40rpx;
  background: $bg-white;
  border-radius: $radius-xl;
  padding: 30rpx;
  box-shadow: $shadow-normal;

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: $font-primary;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid $bg-gray;
  }

  .demo-item {
    .result-text {
      margin-top: 20rpx;
      padding: 20rpx;
      background: $bg-gray;
      border-radius: $radius-base;
      font-size: 24rpx;

      .label {
        color: $font-gray;
        margin-right: 10rpx;
      }

      .value {
        color: $font-primary;
        word-break: break-all;
      }
    }
  }
}

.action-buttons {
  padding: 40rpx 20rpx;
  display: flex;
  gap: 20rpx;

  .action-btn {
    flex: 1;
    padding: 30rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: $radius-xl;
    font-size: $font-size-xl;
    color: #fff;
    box-shadow: $shadow-normal;

    &:active {
      transform: scale(0.98);
    }

    &.reset-btn {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
  }
}
</style>
