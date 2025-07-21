import { Plugin } from 'vite'
import { promises as fs } from 'fs'
import { join, relative, resolve } from 'path'
import chokidar from 'chokidar'

interface MarkdownPluginOptions {
  markdownDir?: string // markdown文件目录，默认为 'static/markdown'
  outputDir?: string // 输出目录，默认为 'src/data'
  outputFile?: string // 输出文件名，默认为 'markdown.ts'
}

export default function markdownPlugin(options: MarkdownPluginOptions = {}): Plugin {
  const {
    markdownDir = 'src/static/markdown',
    outputDir = 'src/data',
    outputFile = 'markdown.ts',
  } = options

  let root: string
  let watcher: chokidar.FSWatcher | null = null

  // 确保目录存在
  async function ensureDir(dir: string) {
    try {
      await fs.access(dir)
    } catch {
      await fs.mkdir(dir, { recursive: true })
    }
  }

  // 读取markdown文件并生成对象
  async function generateMarkdownObject() {
    const markdownPath = resolve(root, markdownDir)
    const outputPath = resolve(root, outputDir)
    const outputFilePath = join(outputPath, outputFile)

    try {
      // 确保markdown目录存在
      await ensureDir(markdownPath)
      // 确保输出目录存在
      await ensureDir(outputPath)

      // 递归读取所有markdown文件
      const markdownFiles: Record<string, string> = {}

      async function readMarkdownFiles(dir: string, basePath: string = '') {
        const files = await fs.readdir(dir, { withFileTypes: true })

        for (const file of files) {
          const fullPath = join(dir, file.name)
          const relativePath = join(basePath, file.name)

          if (file.isDirectory()) {
            await readMarkdownFiles(fullPath, relativePath)
          } else if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8')
              // 使用正斜杠作为路径分隔符，保持一致性
              const normalizedPath = relativePath.replace(/\\/g, '/')
              markdownFiles[normalizedPath] = content
            } catch (error) {
              console.warn(`警告: 无法读取文件 ${fullPath}:`, error)
            }
          }
        }
      }

      await readMarkdownFiles(markdownPath)

      // 生成TypeScript文件内容
      const tsContent = `// 此文件由vite插件自动生成，请勿手动修改
// Generated at: ${new Date().toISOString()}

export const markdownFiles: Record<string, string> = ${JSON.stringify(markdownFiles, null, 2)};

export default markdownFiles;
`

      // 写入文件
      await fs.writeFile(outputFilePath, tsContent, 'utf-8')
      console.log(`✅ Markdown文件已生成: ${relative(root, outputFilePath)}`)
      console.log(`📁 监控的目录: ${relative(root, markdownPath)}`)
      console.log(`📄 找到 ${Object.keys(markdownFiles).length} 个markdown文件`)
    } catch (error) {
      console.error('❌ 生成markdown文件时出错:', error)
    }
  }

  return {
    name: 'vite-markdown-plugin',

    configResolved(config) {
      root = config.root
    },

    async buildStart() {
      // 初始生成
      await generateMarkdownObject()
    },

    configureServer(server) {
      const markdownPath = resolve(root, markdownDir)

      // 开发模式下监听文件变化
      watcher = chokidar.watch(markdownPath, {
        ignored: /node_modules/,
        persistent: true,
        ignoreInitial: true,
      })

      watcher.on('add', async (path) => {
        if (path.endsWith('.md') || path.endsWith('.markdown')) {
          console.log(`📝 检测到新的markdown文件: ${relative(root, path)}`)
          await generateMarkdownObject()
          // 触发热更新
          const module = server.moduleGraph.getModuleById(resolve(root, outputDir, outputFile))
          if (module) {
            server.reloadModule(module)
          }
        }
      })

      watcher.on('change', async (path) => {
        if (path.endsWith('.md') || path.endsWith('.markdown')) {
          console.log(`📝 检测到markdown文件变化: ${relative(root, path)}`)
          await generateMarkdownObject()
          // 触发热更新
          const module = server.moduleGraph.getModuleById(resolve(root, outputDir, outputFile))
          if (module) {
            server.reloadModule(module)
          }
        }
      })

      watcher.on('unlink', async (path) => {
        if (path.endsWith('.md') || path.endsWith('.markdown')) {
          console.log(`🗑️ 检测到markdown文件删除: ${relative(root, path)}`)
          await generateMarkdownObject()
          // 触发热更新
          const module = server.moduleGraph.getModuleById(resolve(root, outputDir, outputFile))
          if (module) {
            server.reloadModule(module)
          }
        }
      })

      // 服务器关闭时清理watcher
      server.httpServer?.on('close', () => {
        if (watcher) {
          watcher.close()
        }
      })
    },

    buildEnd() {
      if (watcher) {
        watcher.close()
        watcher = null
      }
    },
  }
}
