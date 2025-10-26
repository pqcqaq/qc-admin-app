<template>
  <view class="area-selector">
    <view class="selector-input" @click="handleShowPicker">
      <text v-if="displayText" class="selected-text">{{ displayText }}</text>
      <text v-else class="placeholder">{{ placeholder }}</text>
      <text class="arrow-icon">{{ showPicker ? '▲' : '▼' }}</text>
    </view>

    <!-- 级联选择器弹窗 -->
    <view v-if="showPicker" class="picker-mask" @click="handleCancel">
      <view class="picker-container" @click.stop>
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

        <!-- 列表内容 -->
        <scroll-view class="list-container" scroll-y>
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
          <view v-if="loading" class="loading-text">加载中...</view>
          <view v-if="!loading && currentList.length === 0" class="empty-text">暂无数据</view>
        </scroll-view>
      </view>
    </view>
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
  const maxLen = Math.max(tempSelectedItems.value.length + 1, 1)

  for (let i = 0; i < maxLen; i++) {
    if (props.maxLevel !== undefined && i >= props.maxLevel) {
      break
    }
    const item = tempSelectedItems.value[i]
    result.push({
      label: item ? item.name : levelNames[i] || '请选择',
      value: i,
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
const handleTabClick = (index: number) => {
  currentTabIndex.value = index
}

// 判断是否选中
const isSelected = (id: string) => {
  const currentLevel = currentTabIndex.value
  return tempSelectedItems.value[currentLevel]?.id === id
}

// 选择项目
const handleSelectItem = async (item: Area) => {
  const level = currentTabIndex.value

  // 更新临时选择
  tempSelectedItems.value = tempSelectedItems.value.slice(0, level)
  tempSelectedItems.value[level] = item

  // 判断是否为叶子节点
  const isLeaf = shouldBeLeaf(item)

  if (!isLeaf) {
    // 不是叶子节点,加载下一级数据
    await loadAreaData(level + 1, item.id)
    // 自动切换到下一个 tab
    currentTabIndex.value = level + 1
  } else if (props.checkStrictly) {
    // 如果允许选择任意级别,且是叶子节点,直接确认
    handleConfirm()
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
  padding: 20rpx 30rpx;
  background-color: #fff;
  border: 2rpx solid #e4e7ed;
  border-radius: 8rpx;
  min-height: 70rpx;

  .selected-text {
    flex: 1;
    font-size: 28rpx;
    color: #303133;
  }

  .placeholder {
    flex: 1;
    font-size: 28rpx;
    color: #c0c4cc;
  }

  .arrow-icon {
    font-size: 24rpx;
    color: #909399;
    margin-left: 20rpx;
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
  display: flex;
  align-items: flex-end;
}

.picker-container {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 2rpx solid #f0f0f0;

  .cancel-btn,
  .confirm-btn {
    font-size: 28rpx;
    padding: 10rpx 20rpx;
  }

  .cancel-btn {
    color: #909399;
  }

  .confirm-btn {
    color: #409eff;
  }

  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #303133;
  }
}

.tabs {
  display: flex;
  padding: 20rpx 30rpx;
  border-bottom: 2rpx solid #f0f0f0;
  overflow-x: auto;
  white-space: nowrap;

  .tab-item {
    padding: 10rpx 30rpx;
    margin-right: 20rpx;
    font-size: 28rpx;
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

.list-container {
  flex: 1;
  padding: 20rpx 0;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 2rpx solid #f0f0f0;

  &.active {
    background-color: #ecf5ff;

    .item-text {
      color: #409eff;
      font-weight: bold;
    }
  }

  .item-text {
    font-size: 28rpx;
    color: #303133;
  }

  .check-icon {
    font-size: 32rpx;
    color: #409eff;
    font-weight: bold;
  }
}

.loading-text,
.empty-text {
  text-align: center;
  padding: 60rpx;
  font-size: 28rpx;
  color: #909399;
}
</style>
