<template>
  <view class="markdown-renderer">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <text class="loading-text">正在加载...</text>
    </view>

    <!-- 加载失败 -->
    <view v-else-if="error" class="error-container">
      <text class="error-text">{{ error }}</text>
      <button @click="reload" class="retry-button">重试</button>
    </view>

    <!-- 渲染内容 -->
    <view v-else class="markdown-content" v-html="renderedContent"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import { getLocale } from '@/locale'

interface Props {
  /** markdown文件路径，相对于static/markdown目录 */
  src: string
  /** 是否开启HTML标签 */
  html?: boolean
  /** 是否开启链接 */
  linkify?: boolean
  /** 是否开启自动换行 */
  breaks?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  html: true,
  linkify: true,
  breaks: true,
})

const loading = ref(false)
const error = ref('')
const renderedContent = ref('')

// 初始化 markdown-it
const md = new MarkdownIt({
  html: props.html,
  linkify: props.linkify,
  breaks: props.breaks,
})

/**
 * 加载markdown文件
 */
async function loadMarkdown() {
  loading.value = true
  error.value = ''

  const locale = getLocale()

  try {
    // 统一使用uni.request加载文件
    const uniResponse = await new Promise<UniApp.RequestSuccessCallbackResult>(
      (resolve, reject) => {
        // 构造路径，格式类似 /static/markdown/zh-Hans/example.md
        const filePath = `/static/markdown/${locale}/${props.src}`

        uni.request({
          url: filePath,
          method: 'GET',
          success: resolve,
          fail: (error) => {
            reject(new Error(`请求失败: ${error.errMsg || '未知错误'}`))
          },
        })
      },
    )

    let markdownContent = ''
    if (uniResponse.statusCode === 200 && typeof uniResponse.data === 'string') {
      markdownContent = uniResponse.data
    } else {
      throw new Error(`无法加载文件: ${props.src}，状态码: ${uniResponse.statusCode}`)
    }

    // 渲染markdown
    if (markdownContent) {
      renderedContent.value = md.render(markdownContent)
    } else {
      throw new Error('文件内容为空')
    }
  } catch (err) {
    console.error('加载markdown文件失败:', err)
    error.value = `加载失败: ${props.src}。${err instanceof Error ? err.message : '未知错误'}`
  } finally {
    loading.value = false
  }
}

/**
 * 重新加载
 */
function reload() {
  loadMarkdown()
}

// 监听src变化
watch(
  () => props.src,
  () => {
    if (props.src) {
      loadMarkdown()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (props.src) {
    loadMarkdown()
  }
})
</script>

<style lang="scss" scoped>
.markdown-renderer {
  width: 100%;

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;

    .loading-text {
      color: #666;
      font-size: 14px;
    }
  }

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;

    .error-text {
      color: #ff4757;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    .retry-button {
      background-color: #007aff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}
</style>
