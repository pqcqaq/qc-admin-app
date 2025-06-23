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
    let markdownContent = ''

    // #ifdef H5
    // H5平台使用fetch加载文件
    const fetchResponse = await fetch(`/static/markdown/${locale}/${props.src}`)
    if (!fetchResponse.ok) {
      throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
    }
    markdownContent = await fetchResponse.text()
    // #endif

    // #ifndef H5
    // 非H5平台尝试使用uni.request
    const uniResponse = await new Promise<UniApp.RequestSuccessCallbackResult>(
      (resolve, reject) => {
        // 尝试不同的路径格式
        const possiblePaths = [
          `/static/markdown/${props.src}`,
          `../static/markdown/${props.src}`,
          `./static/markdown/${props.src}`,
          `static/markdown/${props.src}`,
        ]

        let attemptIndex = 0

        function tryNextPath() {
          if (attemptIndex >= possiblePaths.length) {
            reject(new Error('所有路径尝试都失败了'))
            return
          }

          uni.request({
            url: possiblePaths[attemptIndex],
            method: 'GET',
            success: resolve,
            fail: () => {
              attemptIndex++
              tryNextPath()
            },
          })
        }

        tryNextPath()
      },
    )

    if (uniResponse.statusCode === 200 && typeof uniResponse.data === 'string') {
      markdownContent = uniResponse.data
    } else {
      throw new Error(`无法加载文件: ${props.src}`)
    }
    // #endif

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

  .markdown-content {
    padding: 16px;
    line-height: 1.6;

    // Markdown样式
    :deep(h1) {
      font-size: 24px;
      font-weight: bold;
      margin: 20px 0 16px 0;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }

    :deep(h2) {
      font-size: 20px;
      font-weight: bold;
      margin: 18px 0 14px 0;
      color: #333;
    }

    :deep(h3) {
      font-size: 18px;
      font-weight: bold;
      margin: 16px 0 12px 0;
      color: #333;
    }

    :deep(h4),
    :deep(h5),
    :deep(h6) {
      font-size: 16px;
      font-weight: bold;
      margin: 14px 0 10px 0;
      color: #333;
    }

    :deep(p) {
      margin: 12px 0;
      color: #555;
      text-align: justify;
    }

    :deep(ul),
    :deep(ol) {
      margin: 12px 0;
      padding-left: 20px;

      li {
        margin: 6px 0;
        color: #555;
      }
    }

    :deep(blockquote) {
      background-color: #f8f9fa;
      border-left: 4px solid #007aff;
      margin: 16px 0;
      padding: 12px 16px;

      p {
        margin: 0;
        color: #666;
        font-style: italic;
      }
    }

    :deep(code) {
      background-color: #f1f3f4;
      color: #d73a49;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 13px;
    }

    :deep(pre) {
      background-color: #f6f8fa;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      padding: 16px;
      margin: 16px 0;
      overflow-x: auto;

      code {
        background-color: transparent;
        color: #24292e;
        padding: 0;
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 13px;
      }
    }

    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;

      th,
      td {
        border: 1px solid #ddd;
        padding: 8px 12px;
        text-align: left;
      }

      th {
        background-color: #f8f9fa;
        font-weight: bold;
      }

      tr:nth-child(even) {
        background-color: #f8f9fa;
      }
    }

    :deep(a) {
      color: #007aff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      margin: 12px 0;
      border-radius: 4px;
    }

    :deep(hr) {
      border: none;
      border-top: 1px solid #eee;
      margin: 24px 0;
    }
  }
}
</style>
