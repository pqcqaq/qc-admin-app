# 📱 QC-Admin App 多端移动应用

[![license](https://img.shields.io/github/license/qc-admin/qc-admin.svg)](LICENSE)
[![uni-app](https://img.shields.io/badge/uni--app-latest-brightgreen.svg)](https://uniapp.dcloud.io/)
[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

**中文** | [English](./README.en-US.md)

## 📖 项目简介

QC-Admin App 是基于 uni-app 框架开发的多端移动应用，支持编译到 iOS、Android、H5、各类小程序等多个平台。与 QC-Admin 后台管理系统无缝集成，提供完整的移动端解决方案。

### ✨ 核心特性

- 🎯 **一次开发，多端运行**: 支持 iOS、Android、H5、微信小程序、支付宝小程序等
- 🚀 **Vue 3 + TypeScript**: 采用最新的技术栈，类型安全
- 💎 **原生性能**: 接近原生应用的流畅体验
- 🔐 **完整认证**: 与后端 RBAC 权限系统深度集成
- 📡 **WebSocket 通信**: 实时消息推送和状态同步
- 🎨 **UnoCSS**: 原子化 CSS，按需加载
- 📦 **组件化开发**: 丰富的业务组件和工具函数
- 🌍 **国际化支持**: 内置 i18n 多语言方案

## 🔗 配套项目

- **后端服务**: [qc-admin-go-backend](../qc-admin-go-backend) - Go 语言后端服务
- **Web 管理端**: [qc-admin](../qc-admin) - Vue 3 后台管理系统
- **通用API**: [qc-admin-api-common](../qc-admin-api-common) - API 接口封装

## 📋 环境要求

- **Node.js**: >= 18.x
- **pnpm**: >= 8.x (推荐使用 pnpm)
- **HBuilderX**: 最新版本 (可选，用于真机调试和打包)
- **微信开发者工具**: 用于小程序开发调试 (可选)

## 🚀 快速开始

### 1. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 注意：只允许使用 pnpm
# 项目已配置 preinstall 钩子，使用其他包管理器会报错
```

### 2. 开发模式

```bash
# H5 开发
pnpm dev
# 或
pnpm dev:h5

# 微信小程序开发
pnpm dev:mp-weixin

# 支付宝小程序开发
pnpm dev:mp-alipay

# App 开发 (需要 HBuilderX)
pnpm dev:app

# Android 开发
pnpm dev:app-android

# iOS 开发
pnpm dev:app-ios
```

### 3. 生产构建

```bash
# H5 构建
pnpm build:h5

# 微信小程序构建
pnpm build:mp-weixin

# App 构建
pnpm build:app

# 查看所有平台构建命令
pnpm run
```

### 4. 预览和调试

#### H5 预览

```bash
pnpm dev:h5
# 访问 http://localhost:5173
```

#### 小程序预览

```bash
# 1. 运行开发命令
pnpm dev:mp-weixin

# 2. 打开微信开发者工具
# 3. 导入项目目录: dist/dev/mp-weixin
```

#### App 预览

```bash
# 使用 HBuilderX 打开项目
# 运行 -> 运行到手机或模拟器
```

## 📁 项目结构

```
qc-admin-app/
├── env/                      # 环境配置
│   ├── .env                 # 基础环境变量
│   ├── .env.development     # 开发环境
│   └── .env.production      # 生产环境
├── scripts/                  # 脚本文件
│   └── postupgrade.js       # 升级后处理脚本
├── src/                      # 源代码目录
│   ├── components/          # 组件
│   │   ├── common/         # 通用组件
│   │   └── business/       # 业务组件
│   ├── config/              # 应用配置
│   ├── custom-tab-bar/      # 自定义 TabBar
│   ├── data/                # 静态数据
│   ├── hooks/               # Composition API 钩子
│   ├── interceptors/        # 拦截器
│   ├── layouts/             # 布局组件
│   ├── locale/              # 国际化资源
│   │   ├── zh-CN.ts        # 简体中文
│   │   └── en-US.ts        # 英文
│   ├── pages/               # 主包页面
│   │   ├── index/          # 首页
│   │   ├── login/          # 登录
│   │   ├── user/           # 用户中心
│   │   └── ...
│   ├── pages-sub/           # 分包页面
│   ├── service/             # API 服务
│   │   ├── auth.ts         # 认证接口
│   │   ├── user.ts         # 用户接口
│   │   └── ...
│   ├── static/              # 静态资源
│   │   ├── images/         # 图片
│   │   └── icons/          # 图标
│   ├── store/               # 状态管理 (Pinia)
│   │   ├── modules/        # 状态模块
│   │   └── index.ts        # Store 入口
│   ├── style/               # 全局样式
│   ├── utils/               # 工具函数
│   ├── App.vue              # 应用根组件
│   ├── main.ts              # 应用入口
│   ├── manifest.json        # 应用配置
│   ├── pages.json           # 页面配置
│   └── uni.scss             # 全局样式变量
├── .editorconfig             # 编辑器配置
├── .gitignore                # Git 忽略配置
├── .prettierrc.cjs           # Prettier 配置
├── index.html                # H5 入口
├── manifest.config.ts        # Manifest 配置
├── openapi-ts-request.config.ts  # OpenAPI 配置
├── package.json              # 项目配置
├── pages.config.ts           # 页面配置
├── tsconfig.json             # TypeScript 配置
├── uno.config.ts             # UnoCSS 配置
└── vite.config.ts            # Vite 配置
```

## 🔧 配置说明

### 环境变量

项目使用环境变量管理不同环境的配置：

```typescript
// env/.env.development
VITE_APP_TITLE=QC-Admin 开发版
VITE_APP_BASE_URL=http://localhost:8080
VITE_APP_API_URL=http://localhost:8080/api/v1
VITE_APP_SOCKET_URL=ws://localhost:8081/ws

// env/.env.production
VITE_APP_TITLE=QC-Admin
VITE_APP_BASE_URL=https://api.example.com
VITE_APP_API_URL=https://api.example.com/api/v1
VITE_APP_SOCKET_URL=wss://api.example.com/ws
```

### 应用配置 (manifest.json)

```json
{
  "name": "QC-Admin",
  "appid": "__UNI__XXXXXXX",
  "description": "QC-Admin 多端应用",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  "app-plus": {
    "usingComponents": true,
    "nvueStyleCompiler": "uni-app",
    "compilerVersion": 3,
    "splashscreen": {
      "alwaysShowBeforeRender": true,
      "waiting": true,
      "autoclose": true,
      "delay": 0
    }
  },
  "quickapp": {},
  "mp-weixin": {
    "appid": "wx_your_appid",
    "setting": {
      "urlCheck": false,
      "minified": true
    },
    "usingComponents": true
  },
  "mp-alipay": {
    "usingComponents": true
  }
}
```

### 页面配置 (pages.json)

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
    }
  },
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    },
    {
      "path": "pages/login/login",
      "style": {
        "navigationBarTitleText": "登录"
      }
    }
  ],
  "subPackages": [
    {
      "root": "pages-sub",
      "pages": []
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "QC-Admin",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#007AFF",
    "borderStyle": "black",
    "backgroundColor": "#F8F8F8",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/tabbar/home.png",
        "selectedIconPath": "static/tabbar/home-active.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/user/user",
        "iconPath": "static/tabbar/user.png",
        "selectedIconPath": "static/tabbar/user-active.png",
        "text": "我的"
      }
    ]
  }
}
```

## 🎨 功能模块

### 1. 用户认证

- ✅ 用户登录/注册
- ✅ 密码找回
- ✅ 验证码登录
- ✅ 第三方登录 (微信、支付宝等)
- ✅ Token 管理和自动刷新

### 2. 用户中心

- ✅ 个人信息管理
- ✅ 头像上传
- ✅ 密码修改
- ✅ 账号安全设置
- ✅ 多语言切换

### 3. 权限管理

- ✅ 基于角色的访问控制
- ✅ 页面级权限控制
- ✅ 按钮级权限控制
- ✅ 动态路由加载

### 4. 文件管理

- ✅ 图片上传
- ✅ 文件预览
- ✅ 相册选择
- ✅ 相机拍照
- ✅ 压缩上传

### 5. 实时通信

- ✅ WebSocket 连接
- ✅ 消息推送
- ✅ 在线状态
- ✅ 断线重连
- ✅ 心跳检测

### 6. 数据同步

- ✅ 本地缓存
- ✅ 离线数据
- ✅ 增量同步
- ✅ 数据持久化

## 📦 核心依赖

```json
{
  "dependencies": {
    "@dcloudio/uni-app": "^3.0.0",
    "@dcloudio/uni-components": "^3.0.0",
    "@dcloudio/uni-h5": "^3.0.0",
    "@dcloudio/uni-mp-weixin": "^3.0.0",
    "vue": "^3.4.0",
    "pinia": "^2.1.0",
    "@vueuse/core": "^10.0.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@dcloudio/vite-plugin-uni": "^3.0.0",
    "@dcloudio/types": "^3.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@unocss/preset-uno": "^0.58.0",
    "unocss": "^0.58.0"
  }
}
```

## 🎯 开发指南

### 创建新页面

1. **在 pages 目录创建页面**

```vue
<!-- src/pages/example/example.vue -->
<template>
  <view class="container">
    <text>{{ title }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('示例页面')

// 页面生命周期
onLoad(() => {
  console.log('页面加载')
})

onShow(() => {
  console.log('页面显示')
})
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
```

2. **在 pages.json 中注册**

```json
{
  "pages": [
    {
      "path": "pages/example/example",
      "style": {
        "navigationBarTitleText": "示例页面"
      }
    }
  ]
}
```

### 创建组件

```vue
<!-- src/components/MyButton.vue -->
<template>
  <button :class="['my-button', `my-button--${type}`]" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'success' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
})

const emit = defineEmits<{
  click: [e: Event]
}>()

const handleClick = (e: Event) => {
  emit('click', e)
}
</script>

<style scoped>
.my-button {
  padding: 10px 20px;
  border-radius: 4px;
}

.my-button--primary {
  background-color: #007aff;
  color: white;
}
</style>
```

### API 请求封装

```typescript
// src/service/user.ts
import { http } from '@/utils/http'

export interface UserInfo {
  id: number
  username: string
  avatar: string
  email: string
}

// 获取用户信息
export const getUserInfo = (id: number) => {
  return http.get<UserInfo>(`/users/${id}`)
}

// 更新用户信息
export const updateUserInfo = (id: number, data: Partial<UserInfo>) => {
  return http.put<UserInfo>(`/users/${id}`, data)
}

// 上传头像
export const uploadAvatar = (filePath: string) => {
  return http.upload<{ url: string }>('/upload/avatar', {
    filePath,
    name: 'file',
  })
}
```

### 状态管理

```typescript
// src/store/modules/user.ts
import { defineStore } from 'pinia'
import { getUserInfo } from '@/service/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
    token: uni.getStorageSync('token') || '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    avatar: (state) => state.userInfo?.avatar || '',
  },

  actions: {
    // 登录
    async login(username: string, password: string) {
      const { data } = await loginApi({ username, password })
      this.token = data.token
      uni.setStorageSync('token', data.token)
    },

    // 获取用户信息
    async fetchUserInfo() {
      const { data } = await getUserInfo()
      this.userInfo = data
    },

    // 退出登录
    logout() {
      this.token = ''
      this.userInfo = null
      uni.removeStorageSync('token')
      uni.reLaunch({ url: '/pages/login/login' })
    },
  },
})
```

### WebSocket 通信

```typescript
// src/utils/socket.ts
import { ref } from 'vue'

class SocketService {
  private socket: UniApp.SocketTask | null = null
  private reconnectTimer: number | null = null
  public isConnected = ref(false)

  connect(url: string) {
    this.socket = uni.connectSocket({
      url,
      success: () => {
        console.log('WebSocket 连接成功')
      },
      fail: (err) => {
        console.error('WebSocket 连接失败', err)
        this.reconnect(url)
      },
    })

    this.socket.onOpen(() => {
      this.isConnected.value = true
      this.startHeartbeat()
    })

    this.socket.onMessage((res) => {
      console.log('收到消息', res.data)
      // 处理消息
    })

    this.socket.onClose(() => {
      this.isConnected.value = false
      this.reconnect(url)
    })

    this.socket.onError((err) => {
      console.error('WebSocket 错误', err)
    })
  }

  send(data: any) {
    if (this.socket && this.isConnected.value) {
      this.socket.send({
        data: JSON.stringify(data),
      })
    }
  }

  close() {
    if (this.socket) {
      this.socket.close({})
      this.socket = null
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
  }

  private reconnect(url: string) {
    if (this.reconnectTimer) return

    this.reconnectTimer = setTimeout(() => {
      console.log('尝试重新连接...')
      this.reconnectTimer = null
      this.connect(url)
    }, 3000) as unknown as number
  }

  private startHeartbeat() {
    setInterval(() => {
      this.send({ type: 'heartbeat' })
    }, 30000)
  }
}

export const socketService = new SocketService()
```

## 🔨 平台差异处理

### 条件编译

```vue
<template>
  <view>
    <!-- #ifdef H5 -->
    <view>H5 平台专属内容</view>
    <!-- #endif -->

    <!-- #ifdef MP-WEIXIN -->
    <view>微信小程序专属内容</view>
    <!-- #endif -->

    <!-- #ifdef APP-PLUS -->
    <view>App 平台专属内容</view>
    <!-- #endif -->
  </view>
</template>

<script>
// #ifdef H5
import H5Module from './h5-module'
// #endif

// #ifdef MP-WEIXIN
import WxModule from './wx-module'
// #endif
</script>

<style>
/* #ifdef H5 */
.h5-style {
  background: red;
}
/* #endif */

/* #ifdef MP-WEIXIN */
.wx-style {
  background: blue;
}
/* #endif */
</style>
```

### 平台判断

```typescript
// 判断平台
if (uni.getSystemInfoSync().platform === 'ios') {
  // iOS 特殊处理
}

// 判断是否是小程序
// #ifdef MP
console.log('小程序环境')
// #endif

// 判断是否是 App
// #ifdef APP-PLUS
console.log('App 环境')
// #endif
```

## 📱 各平台特性

### H5

- ✅ 支持现代浏览器
- ✅ 响应式布局
- ✅ PWA 支持
- ✅ SEO 优化

### 微信小程序

- ✅ 微信登录
- ✅ 微信支付
- ✅ 分享功能
- ✅ 订阅消息

### 支付宝小程序

- ✅ 支付宝登录
- ✅ 支付宝支付
- ✅ 生活号集成

### App (iOS/Android)

- ✅ 原生性能
- ✅ 推送通知
- ✅ 本地存储
- ✅ 相机、相册访问
- ✅ 地理位置
- ✅ 蓝牙、NFC

## 🚀 性能优化

### 1. 分包加载

```json
{
  "subPackages": [
    {
      "root": "pages-sub",
      "pages": [
        {
          "path": "detail/detail",
          "style": {
            "navigationBarTitleText": "详情"
          }
        }
      ]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["pages-sub"]
    }
  }
}
```

### 2. 图片优化

- 使用合适的图片格式 (WebP)
- 图片懒加载
- 压缩图片
- CDN 加速

### 3. 代码优化

```typescript
// 防抖
import { useDebounceFn } from '@vueuse/core'

const debouncedFn = useDebounceFn(() => {
  // 执行操作
}, 300)

// 节流
import { useThrottleFn } from '@vueuse/core'

const throttledFn = useThrottleFn(() => {
  // 执行操作
}, 1000)
```

### 4. 数据缓存

```typescript
// 缓存数据
uni.setStorageSync('key', value)

// 读取缓存
const value = uni.getStorageSync('key')

// 移除缓存
uni.removeStorageSync('key')
```

## 🐛 调试技巧

### H5 调试

```bash
pnpm dev:h5
# 使用浏览器开发者工具调试
```

### 小程序调试

1. 运行开发命令
2. 使用开发者工具的调试功能
3. 真机调试

### App 调试

1. 使用 HBuilderX 的内置调试工具
2. 真机 USB 调试
3. 日志查看

## 📊 发布流程

### H5 发布

```bash
pnpm build:h5
# 将 dist/build/h5 目录部署到服务器
```

### 小程序发布

```bash
# 1. 构建
pnpm build:mp-weixin

# 2. 使用开发者工具上传代码
# 3. 提交审核
# 4. 发布上线
```

### App 发布

```bash
# 1. 构建
pnpm build:app

# 2. 使用 HBuilderX 云打包
# 3. 提交应用商店审核
# 4. 发布上线
```

## 🔗 相关链接

### 官方文档

- [uni-app 官方文档](https://uniapp.dcloud.io/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/zh/)
- [UnoCSS 文档](https://unocss.dev/)

### 项目文档

- [后端 API 文档](../qc-admin-go-backend/README.md)
- [Web 管理端文档](../qc-admin/README.md)
- [RBAC 权限文档](../qc-admin-go-backend/README_AUTH.md)
- [WebSocket 文档](../qc-admin-api-common/README.md)

### 工具和资源

- [HBuilderX](https://www.dcloud.io/hbuilderx.html)
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [支付宝开发者工具](https://opendocs.alipay.com/mini/ide/download)

## 🤝 参与贡献

我们欢迎所有形式的贡献！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某个很棒的特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 开源协议

本项目基于 [MIT](./LICENSE) 协议开源。

## 👥 维护者

[@pqcqaq](https://github.com/pqcqaq)

## 🙏 致谢

- [uni-app](https://uniapp.dcloud.io/) - 优秀的跨端框架
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [DCloud](https://www.dcloud.io/) - 提供完善的开发工具
- [UniBest](https://github.com/unibest-tech/unibest) - 提供基础开发框架

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！
