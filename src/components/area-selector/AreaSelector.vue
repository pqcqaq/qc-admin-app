<template>
  <view class="area-selector">
    <view class="selector-input" @click="handleShowPicker">
      <text v-if="displayText" class="selected-text">{{ displayText }}</text>
      <text v-else class="placeholder">{{ placeholder }}</text>
      <text class="arrow-icon">{{ showPicker ? '▲' : '▼' }}</text>
    </view>

    <!-- 级联选择器弹窗 -->
    <!-- 遮罩层 - 淡入淡出 -->
    <transition name="mask-fade">
      <view v-if="showPicker" class="picker-mask" @click="handleCancel"></view>
    </transition>

    <!-- 弹窗容器 - 底部滑入滑出 -->
    <transition name="slide-up">
      <view v-if="showPicker" class="picker-container" @click.stop>
        <!-- 头部 -->
        <view class="picker-header">
          <text class="cancel-btn" @click="handleCancel">取消</text>
          <text class="title">选择地区</text>
          <text class="confirm-btn" @click="handleConfirm">确定</text>
        </view>

        <!-- Tab 切换 -->
        <view class="tabs">
          <view
            v-for="(tab, index) in tabs"
            :key="index"
            class="tab-item"
            :class="{ active: currentTabIndex === index }"
            @click="handleTabClick(index)"
          >
            <text class="tab-text">{{ tab.label }}</text>
          </view>
        </view>

        <!-- 列表内容 - 添加左右滑动动画 -->
        <view class="list-wrapper">
          <!-- 加载动画 - 居中显示 -->
          <view v-if="loading" class="loading-overlay">
            <view class="loading-spinner"></view>
            <text class="loading-text">加载中...</text>
          </view>

          <transition :name="slideDirection">
            <scroll-view :key="currentTabIndex" class="list-container" scroll-y>
              <view
                v-for="item in currentList"
                :key="item.id"
                class="list-item"
                :class="{ active: isSelected(item.id) }"
                @click="handleSelectItem(item)"
              >
                <text class="item-text">{{ item.name }}</text>
                <text v-if="isSelected(item.id)" class="check-icon">✓</text>
              </view>
              <view v-if="!loading && currentList.length === 0" class="empty-text">暂无数据</view>
            </scroll-view>
          </transition>
        </view>
      </view>
    </transition>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getAreasByParentId, type Area } from 'qc-admin-api-common/area'

interface AreaSelectorProps {
  /** v-model绑定的地区ID列表 */
  modelValue?: string[]
  /** v-model:current绑定的当前最后一级地区ID */
  current?: string
  /** 选择级别限制,如设置为3表示最多选择到第3级(city) */
  maxLevel?: number
  /** 限制在某个地区下的子项选择 */
  parentAreaId?: string
  /** 是否可以选择任意一级,不必选到最后一级 */
  checkStrictly?: boolean
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
}

const props = withDefaults(defineProps<AreaSelectorProps>(), {
  modelValue: () => [],
  current: '',
  maxLevel: undefined,
  parentAreaId: '',
  checkStrictly: false,
  placeholder: '请选择地区',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'update:current': [value: string]
  change: [value: string[], currentId: string]
}>()

// 级别映射
const levelMap = {
  country: 0,
  province: 1,
  city: 2,
  district: 3,
  street: 4,
}

const levelNames = ['国家', '省份', '城市', '区县', '街道']

// 数据状态
const showPicker = ref(false)
const loading = ref(false)
const currentTabIndex = ref(0)
const prevTabIndex = ref(0)
const slideDirection = ref('slide-left')
const isSelecting = ref(false) // 防止快速点击

// 存储每个级别的数据
const levelData = ref<Area[][]>([])
// 存储每个级别选中的项
const selectedItems = ref<Area[]>([])
// 临时选择(确认前的选择)
const tempSelectedItems = ref<Area[]>([])

// 当前列表
const currentList = computed(() => {
  return levelData.value[currentTabIndex.value] || []
})

// Tab 标签
const tabs = computed(() => {
  const result: { label: string; value: number }[] = []

  // 只显示已选择的项和当前有数据的级别
  for (let i = 0; i < tempSelectedItems.value.length; i++) {
    if (props.maxLevel !== undefined && i >= props.maxLevel) {
      break
    }
    const item = tempSelectedItems.value[i]
    result.push({
      label: item.name,
      value: i,
    })
  }

  // 只有当下一级有数据时才显示"请选择"
  const nextLevel = tempSelectedItems.value.length
  if (props.maxLevel === undefined || nextLevel < props.maxLevel) {
    const nextLevelData = levelData.value[nextLevel]
    if (nextLevelData && nextLevelData.length > 0) {
      result.push({
        label: levelNames[nextLevel] || '请选择',
        value: nextLevel,
      })
    }
  }

  // 如果没有任何选择,显示第一级
  if (result.length === 0) {
    result.push({
      label: levelNames[0] || '请选择',
      value: 0,
    })
  }

  return result
})

// 显示文本
const displayText = computed(() => {
  if (selectedItems.value.length === 0) return ''
  return selectedItems.value.map((item) => item.name).join(' / ')
})

// 显示选择器
const handleShowPicker = () => {
  if (props.disabled) return
  showPicker.value = true
  // 初始化临时选择
  tempSelectedItems.value = [...selectedItems.value]
  currentTabIndex.value = 0
  // 加载初始数据
  loadAreaData(0, props.parentAreaId || '')
}

// 加载地区数据
const loadAreaData = async (level: number, parentId: string) => {
  if (props.maxLevel !== undefined && level >= props.maxLevel) {
    return
  }

  loading.value = true
  try {
    const response = await getAreasByParentId(parentId)
    const areas = response.data || []

    // 更新当前级别的数据
    levelData.value[level] = areas

    // 清空后续级别的数据
    levelData.value = levelData.value.slice(0, level + 1)
  } catch (error) {
    console.error('加载地区数据失败:', error)
    uni.showToast({
      title: '加载地区数据失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// Tab 点击
const handleTabClick = async (index: number) => {
  // 设置滑动方向
  slideDirection.value = index > prevTabIndex.value ? 'slide-left' : 'slide-right'
  prevTabIndex.value = currentTabIndex.value
  currentTabIndex.value = index

  // 如果点击的是已选择的级别,需要重新加载该级别的数据
  if (index < tempSelectedItems.value.length) {
    // 点击的是已选择的某一级,重新加载该级别的数据
    const parentId = index === 0 ? props.parentAreaId || '' : tempSelectedItems.value[index - 1].id
    await loadAreaData(index, parentId)
  } else if (index === 0 && levelData.value[0]?.length === 0) {
    // 点击第一级且没有数据时,加载第一级数据
    await loadAreaData(0, props.parentAreaId || '')
  }
}

// 判断是否选中
const isSelected = (id: string) => {
  const currentLevel = currentTabIndex.value
  return tempSelectedItems.value[currentLevel]?.id === id
}

// 选择项目
const handleSelectItem = async (item: Area) => {
  // 防止快速点击导致重复选择
  if (isSelecting.value || loading.value) {
    return
  }

  isSelecting.value = true

  try {
    const level = currentTabIndex.value

    // 更新临时选择
    tempSelectedItems.value = tempSelectedItems.value.slice(0, level)
    tempSelectedItems.value[level] = item

    // 判断是否为叶子节点
    const isLeaf = shouldBeLeaf(item)

    if (!isLeaf) {
      // 不是叶子节点,尝试加载下一级数据
      await loadAreaData(level + 1, item.id)

      // 检查是否加载到了数据
      const nextLevelData = levelData.value[level + 1]
      if (nextLevelData && nextLevelData.length > 0) {
        // 有下一级数据,自动切换到下一个 tab (向左滑动)
        slideDirection.value = 'slide-left'
        prevTabIndex.value = currentTabIndex.value
        currentTabIndex.value = level + 1
      } else {
        // 没有下一级数据,说明当前节点就是最后一级
        if (!props.checkStrictly) {
          // 如果不允许选择任意级别,自动确认
          handleConfirm()
        }
      }
    } else if (props.checkStrictly) {
      // 如果允许选择任意级别,且是叶子节点,直接确认
      handleConfirm()
    }
  } finally {
    // 延迟解锁,防止过快点击
    setTimeout(() => {
      isSelecting.value = false
    }, 300)
  }
}

// 判断节点是否应该为叶子节点
const shouldBeLeaf = (area: Area): boolean => {
  // 如果设置了最大级别
  if (props.maxLevel !== undefined) {
    const currentLevel = levelMap[area.level]
    return currentLevel >= props.maxLevel - 1
  }

  // 街道级别是叶子节点
  return area.level === 'street'
}

// 取消
const handleCancel = () => {
  showPicker.value = false
  // 恢复原来的选择
  tempSelectedItems.value = [...selectedItems.value]
}

// 确认
const handleConfirm = () => {
  // 检查是否需要选到最后一级
  if (!props.checkStrictly && tempSelectedItems.value.length === 0) {
    uni.showToast({
      title: '请选择地区',
      icon: 'none',
    })
    return
  }

  // 更新选择
  selectedItems.value = [...tempSelectedItems.value]

  // 构建ID数组
  const ids = selectedItems.value.map((item) => item.id)
  const currentId = ids.length > 0 ? ids[ids.length - 1] : ''

  // 发送事件
  emit('update:modelValue', ids)
  emit('update:current', currentId)
  emit('change', ids, currentId)

  // 关闭弹窗
  showPicker.value = false
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  async (val) => {
    // 如果外部清空了值,需要同步清空内部选择
    if (!val || val.length === 0) {
      if (selectedItems.value.length > 0) {
        selectedItems.value = []
        tempSelectedItems.value = []
        levelData.value = []
      }
      return
    }

    // 如果有值且与当前选择不同
    if (JSON.stringify(val) !== JSON.stringify(selectedItems.value.map((item) => item.id))) {
      // TODO: 根据ID数组加载完整的地区信息
      // 这里需要额外的API来根据ID获取地区信息
      console.log('modelValue changed:', val)
    }
  },
  { immediate: true },
)

// 监听 parentAreaId 变化
watch(
  () => props.parentAreaId,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      // 清空选择
      selectedItems.value = []
      tempSelectedItems.value = []
      levelData.value = []
      emit('update:modelValue', [])
      emit('update:current', '')
    }
  },
)
</script>

<style scoped lang="scss">
.area-selector {
  width: 100%;
}

.selector-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  background-color: #fff;
  border: 2rpx solid #e4e7ed;
  border-radius: 8rpx;
  min-height: 64rpx;

  .selected-text {
    flex: 1;
    font-size: 26rpx;
    color: #303133;
  }

  .placeholder {
    flex: 1;
    font-size: 26rpx;
    color: #c0c4cc;
  }

  .arrow-icon {
    font-size: 22rpx;
    color: #909399;
    margin-left: 16rpx;
  }
}

.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 遮罩层淡入淡出动画 */
.mask-fade-enter-active,
.mask-fade-leave-active {
  transition: opacity 0.3s ease;
}

.mask-fade-enter-from,
.mask-fade-leave-to {
  opacity: 0;
}

.picker-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  height: 65vh;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

/* 弹窗容器底部滑入滑出动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  border-bottom: 2rpx solid #f0f0f0;

  .cancel-btn,
  .confirm-btn {
    font-size: 26rpx;
    padding: 8rpx 16rpx;
  }

  .cancel-btn {
    color: #909399;
  }

  .confirm-btn {
    color: #409eff;
  }

  .title {
    font-size: 30rpx;
    font-weight: bold;
    color: #303133;
  }
}

.tabs {
  display: flex;
  padding: 16rpx 24rpx;
  border-bottom: 2rpx solid #f0f0f0;
  overflow-x: auto;
  white-space: nowrap;

  .tab-item {
    padding: 8rpx 24rpx;
    margin-right: 16rpx;
    font-size: 26rpx;
    color: #606266;
    border-radius: 8rpx;

    &.active {
      color: #409eff;
      background-color: #ecf5ff;
    }

    .tab-text {
      white-space: nowrap;
    }
  }
}

/* 列表容器包裹器 */
.list-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* 加载动画覆盖层 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #e4e7ed;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #909399;
}

.list-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12rpx 0;
}

.list-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12rpx 0;
}

/* 左滑动画 - 向左切换(下一级) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* 右滑动画 - 向右切换(上一级) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  border-bottom: 2rpx solid #f0f0f0;

  &.active {
    background-color: #ecf5ff;

    .item-text {
      color: #409eff;
      font-weight: bold;
    }
  }

  .item-text {
    font-size: 26rpx;
    color: #303133;
  }

  .check-icon {
    font-size: 28rpx;
    color: #409eff;
    font-weight: bold;
  }
}

.empty-text {
  text-align: center;
  padding: 48rpx;
  font-size: 26rpx;
  color: #909399;
}
</style>
