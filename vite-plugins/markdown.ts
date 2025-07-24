import { Plugin } from 'vite'
import { promises as fs } from 'fs'
import { join, relative, resolve } from 'path'
import { createHash } from 'crypto'
import chokidar from 'chokidar'

interface MarkdownPluginOptions {
  markdownDir?: string // markdown文件目录，默认为 'static/markdown'
  outputDir?: string // 输出目录，默认为 'src/data'
  outputFile?: string // 输出文件名，默认为 'markdown.ts'
}

interface FileHashRecord {
  [filePath: string]: string // 文件路径 -> MD5哈希值
}

export default function markdownPlugin(options: MarkdownPluginOptions = {}): Plugin {
  const {
    markdownDir = 'src/static/markdown',
    outputDir = 'src/data',
    outputFile = 'markdown.ts',
  } = options

  let root: string
  let watcher: chokidar.FSWatcher | null = null

  // MD5缓存文件路径
  const getHashCacheFile = () => join(resolve(root, outputDir), '.markdown-hashes.json')

  // 计算文件的MD5哈希值
  function calculateMD5(content: string): string {
    return createHash('md5').update(content, 'utf8').digest('hex')
  }

  // 读取哈希缓存
  async function loadHashCache(): Promise<FileHashRecord> {
    const cacheFile = getHashCacheFile()
    try {
      const content = await fs.readFile(cacheFile, 'utf-8')
      return JSON.parse(content)
    } catch {
      // 文件不存在或无法读取，返回空对象
      return {}
    }
  }

  // 保存哈希缓存
  async function saveHashCache(hashRecord: FileHashRecord): Promise<void> {
    const cacheFile = getHashCacheFile()
    try {
      await fs.writeFile(cacheFile, JSON.stringify(hashRecord, null, 2), 'utf-8')
    } catch (error) {
      console.warn(`警告: 无法保存哈希缓存文件:`, error)
    }
  }

  // 确保目录存在
  async function ensureDir(dir: string) {
    try {
      await fs.access(dir)
    } catch {
      await fs.mkdir(dir, { recursive: true })
    }
  }

  // 读取markdown文件并生成对象
  async function generateMarkdownObject(forceUpdate: boolean = false) {
    const markdownPath = resolve(root, markdownDir)
    const outputPath = resolve(root, outputDir)
    const outputFilePath = join(outputPath, outputFile)

    try {
      // 确保markdown目录存在
      await ensureDir(markdownPath)
      // 确保输出目录存在
      await ensureDir(outputPath)

      // 加载现有的哈希缓存
      const existingHashes = await loadHashCache()
      const newHashes: FileHashRecord = {}
      const markdownFiles: Record<string, string> = {}
      let hasChanges = false

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
              const normalizedPath = relativePath.replace(/\\/g, '/')
              const contentHash = calculateMD5(content)

              // 更新新的哈希记录
              newHashes[normalizedPath] = contentHash

              // 检查文件是否有变化
              if (existingHashes[normalizedPath] !== contentHash) {
                hasChanges = true
                console.log(`📝 检测到文件变化: ${normalizedPath}`)
              }

              markdownFiles[normalizedPath] = content
            } catch (error) {
              console.warn(`警告: 无法读取文件 ${fullPath}:`, error)
            }
          }
        }
      }

      await readMarkdownFiles(markdownPath)

      // 检查是否有文件被删除
      for (const oldPath in existingHashes) {
        if (!(oldPath in newHashes)) {
          hasChanges = true
          console.log(`🗑️ 检测到文件删除: ${oldPath}`)
        }
      }

      // 检查输出文件是否存在，如果不存在则强制生成
      try {
        await fs.access(outputFilePath)
      } catch {
        hasChanges = true
        console.log(`📄 输出文件不存在，需要生成`)
      }

      // 强制更新时也设置hasChanges
      if (forceUpdate) {
        hasChanges = true
      }

      // 只有在有变化时才重新生成文件
      if (hasChanges) {
        // 生成TypeScript文件内容（移除时间戳避免重复编译）
        const tsContent = `// 此文件由vite插件自动生成，请勿手动修改

export const markdownFiles: Record<string, string> = ${JSON.stringify(markdownFiles, null, 2)};

export default markdownFiles;
`

        // 写入文件
        await fs.writeFile(outputFilePath, tsContent, 'utf-8')

        // 保存新的哈希缓存
        await saveHashCache(newHashes)

        console.log(`✅ Markdown文件已更新: ${relative(root, outputFilePath)}`)
        console.log(`📁 监控的目录: ${relative(root, markdownPath)}`)
        console.log(`📄 处理了 ${Object.keys(markdownFiles).length} 个markdown文件`)

        return true // 表示文件已更新
      } else {
        console.log(`⚡ 没有检测到markdown文件变化，跳过重新生成`)
        return false // 表示没有更新
      }
    } catch (error) {
      console.error('❌ 生成markdown文件时出错:', error)
      return false
    }
  }

  return {
    name: 'vite-markdown-plugin',

    configResolved(config) {
      root = config.root
    },

    async buildStart() {
      // 初始生成（只在输出文件不存在时强制更新）
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

      const handleFileChange = async (path: string, eventType: string) => {
        if (path.endsWith('.md') || path.endsWith('.markdown')) {
          console.log(`📝 检测到markdown文件${eventType}: ${relative(root, path)}`)
          const hasUpdated = await generateMarkdownObject()

          // 只有在文件确实有更新时才触发热更新
          if (hasUpdated) {
            const module = server.moduleGraph.getModuleById(resolve(root, outputDir, outputFile))
            if (module) {
              server.reloadModule(module)
            }
          }
        }
      }

      watcher.on('add', (path) => handleFileChange(path, '新增'))
      watcher.on('change', (path) => handleFileChange(path, '修改'))
      watcher.on('unlink', (path) => handleFileChange(path, '删除'))

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
