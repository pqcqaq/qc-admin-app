# MarkdownRenderer 组件

一个用于在uni-app项目中渲染Markdown文档的Vue组件。

## 功能特性

- ✅ 支持标准Markdown语法
- ✅ 自动从`static/markdown`目录加载文件
- ✅ 加载失败时显示错误信息和重试按钮
- ✅ 完整的样式支持（标题、列表、代码、表格等）
- ✅ TypeScript支持
- ✅ 响应式设计

## 安装依赖

```bash
pnpm add markdown-it @types/markdown-it
```

## 使用方法

### 基础用法

```vue
<template>
  <MarkdownRenderer src="example.md" />
</template>

<script setup>
import MarkdownRenderer from '@/components/markdown-renderer/MarkdownRenderer.vue'
</script>
```

### 配置选项

```vue
<template>
  <MarkdownRenderer src="example.md" :html="true" :linkify="true" :breaks="true" />
</template>
```

## Props

| 属性    | 类型    | 默认值 | 说明                                          |
| ------- | ------- | ------ | --------------------------------------------- |
| src     | string  | -      | Markdown文件路径，相对于`static/markdown`目录 |
| html    | boolean | true   | 是否启用HTML标签支持                          |
| linkify | boolean | true   | 是否自动转换URL为链接                         |
| breaks  | boolean | true   | 是否启用自动换行                              |

## 文件结构

```
src/
├── static/
│   └── markdown/
│       ├── example.md
│       └── your-markdown-files.md
└── components/
    └── markdown-renderer/
        ├── MarkdownRenderer.vue
        └── README.md
```

## 示例文件

在`src/static/markdown/`目录下放置你的Markdown文件：

```markdown
# 我的文档

这是一个**示例**文档。

## 列表

- 项目1
- 项目2
- 项目3

## 代码

\`\`\`javascript
console.log('Hello World!')
\`\`\`
```

## 样式自定义

组件提供了完整的Markdown样式，你也可以通过CSS覆盖来自定义样式：

```scss
:deep(.markdown-content) {
  h1 {
    color: your-color;
  }

  code {
    background-color: your-bg-color;
  }
}
```

## 错误处理

- 文件不存在时会显示错误信息
- 提供重试按钮重新加载
- 控制台会输出详细错误信息

## 注意事项

1. 确保Markdown文件放在`src/static/markdown/`目录下
2. 文件名使用相对路径，不需要包含目录前缀
3. 组件会自动处理加载状态和错误状态
4. 支持所有标准Markdown语法

## 演示页面

访问 `/pages/markdown-demo/index` 查看组件演示效果。
