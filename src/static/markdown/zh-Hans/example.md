# 示例Markdown文档

这是一个用于测试**MarkdownRenderer**组件的示例文档。

## 功能特性

- 支持标准Markdown语法
- 自动拉取static/markdown目录下的文件
- 加载失败时显示错误信息
- 支持重试功能

## 代码示例

```javascript
// 使用示例
<MarkdownRenderer src="example.md" />
```

## 表格示例

| 功能 | 状态 | 描述                 |
| ---- | ---- | -------------------- |
| 标题 | ✅   | 支持H1-H6标题        |
| 列表 | ✅   | 支持有序和无序列表   |
| 代码 | ✅   | 支持行内代码和代码块 |
| 表格 | ✅   | 支持表格渲染         |

## 引用

> 这是一个引用示例。
> 可以用来强调重要信息。

## 链接

欢迎访问 [Vue官网](https://vuejs.org/) 了解更多信息。

---

**注意：** 确保markdown文件放在 `src/static/markdown/` 目录下。
