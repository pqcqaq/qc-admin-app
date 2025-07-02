<route lang="json5" type="page">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view class="flex flex-col h-screen relative">
    <!-- 顶部自定义导航栏 -->
    <view class="bgColor pt-8 pb-10 px-4 relative">
      <view class="flex items-center">
        <view class="w-8 flex items-center justify-start">
          <wd-icon name="arrow-left" color="#fff" size="24" @click="onBack" />
        </view>
        <view class="flex-1 text-center text-white text-lg font-bold">
          {{ t('task_review') }}
        </view>
        <view class="w-8"></view>
      </view>
      <view class="flex justify-center items-center mt-2 text-white text-sm">
        <view class="flex items-center">
          <wd-icon name="calendar" size="16" class="mr-1" />
          <text>{{ query.time ? query.time : '2025年6月9日' }}</text>
        </view>
        <view class="mx-4"></view>
        <view class="flex items-center">
          <wd-icon name="shop" size="16" class="mr-1" />
          <text>{{ query.shopName ? query.shopName : '黄龙体育中心店' }}</text>
        </view>
      </view>
    </view>
    <!--审核项 -->
    <view class="relative z-10">
      <view class="mt-[-32px]">
        <view class="flex items-center px-6 py-4 bg-white rounded-t-3xl">
          <wd-icon name="bulletpoint" size="24" class="mr-3" />
          <text class="text-gray-700 text-base mr-3">{{ t('inspection_item') }}</text>
          <wd-progress
            :percentage="progressPercent"
            color="#26b7a7"
            class="flex-1 mx-4"
            hide-text
          />
          <text class="text-gray-500 text-base ml-3">
            {{ pageData.checkedCount }}/{{ pageData.totalCount }}
          </text>
        </view>
      </view>
    </view>
    <!--    审核完成-->
    <view v-if="isFinished" class="bottom-content w-full h-full flex items-center justify-center">
      <view class="flex items-center justify-center">
        <image class="w-[80px] h-[80px]" :src="inspection_statistics"></image>
        <view class="text-xl pl-2 pt-1 flex-col items-center justify-center">
          <view class="flex items-center justify-center">{{ t('review_today') }}</view>
          <view class="flex items-center justify-center pl-2">{{ t('completed') }}</view>
        </view>
      </view>
    </view>
    <!--    审核未完成-->
    <template v-else>
      <!--    主体区-->
      <view class="bottom-content flex-1 px-8 py-4">
        <view class="bg-white px-4 py-2 rounded">
          <view class="text-base font-medium">
            {{ selectItem?.detectionRule.type || '食品保鲜' }}
          </view>
          <view class="mt-3">
            <text class="ai italic bold px-1">AI</text>
            {{ t('comment') }}
            <text class="px-2 text-sm" :style="{ color: 'red' }">{{ t('unqualified') }}</text>
            <text class="text-sm">{{ selectItem?.detectionTask.detectionMessage }}</text>
            <wd-img
              :width="100"
              :height="100"
              :src="
                selectItem?.detectionTask.detection.imageUrl === ''
                  ? 'https://null'
                  : selectItem?.detectionTask.detection.imageUrl
              "
            >
              <template #error>
                <view class="error-wrap">{{ t('loading_failure') }}</view>
              </template>
              <template #loading>
                <view class="loading-wrap">
                  <wd-loading />
                </view>
              </template>
            </wd-img>
          </view>
        </view>
        <view class="flex justify-end items-center py-2">
          <view class="font-medium">
            {{
              selectItem?.appealState === AppealStateEnum.Appeal
                ? t('appeal_statement')
                : t('rectification_statement')
            }}
          </view>
          <view class="rounded-full bg-white ml-4 p2 pt-1">
            <image :src="rectification_user" class="w-[20px] h-[20px]"></image>
          </view>
        </view>
        <view class="bg-white px-4 py-4 rounded">
          <view class="bg-gray-100 rounded-sm px-2 py-1 text-gray-500 text-sm">
            {{ selectItem?.text }}
          </view>
          <view class="py-4">{{ t('upload_photos') }}:</view>
          <wd-img
            :width="100"
            :height="100"
            :src="selectItem?.imageUrlList"
            @click="previewImage(0, selectItem.imageUrlList)"
          >
            <template #error>
              <view class="error-wrap">{{ t('loading_failure') }}</view>
            </template>
            <template #loading>
              <view class="loading-wrap">
                <wd-loading />
              </view>
            </template>
          </wd-img>
        </view>
      </view>
      <!--   底部按钮-->
      <view
        class="footer w-full absolute bg-white flex justify-around items-center"
        v-if="selectItem?.approveState === ApproveStateEnum.NOT_DO"
      >
        <wd-button
          type="info"
          :round="false"
          size="large"
          @click="ChangeApproveState(ApproveStateEnum.NOT_PASS)"
        >
          {{ t('review_disagrees') }}
        </wd-button>
        <wd-button
          type="success"
          :round="false"
          size="large"
          @click="ChangeApproveState(ApproveStateEnum.PASSED)"
        >
          {{ t('review_agrees') }}
        </wd-button>
      </view>
      <view v-else class="footer w-full absolute bg-white flex justify-end items-center">
        <view class="mr-4">
          <wd-button
            type="success"
            :round="false"
            size="large"
            @click="pageData.selectedIndex = pageData.selectedIndex + 1"
          >
            {{ t('next') }}
          </wd-button>
        </view>
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
const inspection_statistics = ref('static/icon/inspection_statistics_qualified_item_icon.svg')
const rectification_user = ref('static/icon/rectification_user_icon.svg')

import { useI18n } from 'vue-i18n'
import { getAuditDetail, updateAuditApprovestate } from '@/api/audit'
const i18n = useI18n()
const t = i18n.t
import { useMessage } from 'wot-design-uni'

enum AppealStateEnum {
  Appeal = 1, //申诉
  Rectification = 0, //整改
}
enum ApproveStateEnum {
  NOT_DO = 0, //未审核
  PASSED = 1, //已通过
  NOT_PASS = 2, //未通过
}
//路由接收
const query = defineProps<{
  id: string
  time: string
  shopName: string
}>()

const pageData = reactive({
  list: [], //列表数据
  totalCount: 1, //总共审核项
  checkedCount: 0, //已经审核完成的项目
  loading: false, //加载中
  selectedIndex: 0,
})
const onBack = () => {
  uni.navigateBack()
}
//审核是否完成
const isFinished = computed(() => pageData.checkedCount == pageData.totalCount)
//审核进度
const progressPercent = computed(() => (pageData.checkedCount / (pageData.totalCount || 1)) * 100)
const selectItem = computed(() => {
  try {
    return pageData.list[pageData.selectedIndex]
  } catch {
    return {}
  }
})
//获取待审核的数量
const getCheckedCount = () => {
  pageData.checkedCount = pageData.list.filter(
    (v) => v.approveState !== ApproveStateEnum.NOT_DO,
  ).length
}
const getData = async () => {
  pageData.loading = true
  const { data } = await getAuditDetail({ id: query.id ? Number(query.id) : 49 })
  pageData.loading = false
  pageData.list = data?.rows || []
  pageData.totalCount = pageData.list.length
  getCheckedCount()
}
onLoad((options) => {
  getData()
})
//预览图片(多图),目前为string，暂未用到图片切换功能
const previewImage = (index, list) => {
  uni.previewImage({
    current: index,
    urls: [list],
  })
}
const message = useMessage()

//修改审核状态
const ChangeApproveState = async (state) => {
  try {
    await updateAuditApprovestate({
      detectionTaskRectifiedDetailId: selectItem.value.id,
      approveState: state,
      lastDetailFlag: pageData.checkedCount == pageData.totalCount - 1,
    })
    message.alert({
      msg: t('successful'),
      confirmButtonText: t('ok'),
    })
    selectItem.value.approveState = state
    getCheckedCount()
    //自动跳转到下一项
    pageData.selectedIndex += 1
  } catch {
    message.alert({
      msg: t('failure'),
      confirmButtonText: t('ok'),
    })
  }
}
</script>

<style lang="scss" scoped>
.bgColor {
  background-color: var(--wot-color-theme);
}
:deep(.wd-progress) {
  .wd-progress__outer {
    height: 6px;
  }
}
:deep(.wd-img) {
  display: block;
}
.bottom-content {
  background-color: #f7f7f7;
  overflow: auto;
}
.footer {
  bottom: 0;
  height: 80px;
}
.ai {
  background: linear-gradient(to right, #389983, #34917c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.error-wrap {
  width: 100%;
  height: 100%;
  line-height: 100px;
  text-align: center;
}

.loading-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
