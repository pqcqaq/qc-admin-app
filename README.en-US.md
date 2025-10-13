# 📱 QC-Admin App Multi-Platform Mobile Application

[![license](https://img.shields.io/github/license/pqcqaq/qc-admin-app.svg)](LICENSE)
[![uni-app](https://img.shields.io/badge/uni--app-latest-brightgreen.svg)](https://uniapp.dcloud.io/)
[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

[中文](./README.md) | **English**

## 📖 Introduction

QC-Admin App is a multi-platform mobile application developed based on the uni-app framework, supporting compilation to iOS, Android, H5, various mini-programs, and more. Seamlessly integrated with the QC-Admin backend management system, providing a complete mobile solution.

### ✨ Features

- 🎯 **Write Once, Run Anywhere**: iOS, Android, H5, WeChat Mini Program, Alipay Mini Program, etc.
- 🚀 **Vue 3 + TypeScript**: Latest tech stack with type safety
- 💎 **Native Performance**: Near-native app experience
- 🔐 **Complete Authentication**: Deep integration with backend RBAC system
- 📡 **WebSocket**: Real-time messaging and status synchronization
- 🎨 **UnoCSS**: Atomic CSS with on-demand loading
- 📦 **Component-based**: Rich business components and utilities
- 🌍 **i18n Support**: Built-in multi-language solution

## 🔗 Related Projects

- **Backend**: [qc-admin-go-backend](../qc-admin-go-backend) - Go backend service
- **Web Admin**: [qc-admin](../qc-admin) - Vue 3 management system
- **Common API**: [qc-admin-api-common](../qc-admin-api-common) - API interface encapsulation

## 📋 Requirements

- **Node.js**: >= 18.x
- **pnpm**: >= 8.x (recommended)
- **HBuilderX**: Latest version (optional, for native debugging)
- **WeChat DevTools**: For mini-program development (optional)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Using pnpm (required)
pnpm install

# Note: Only pnpm is allowed
# The project has a preinstall hook that prevents other package managers
```

### 2. Development

```bash
# H5 development
pnpm dev
# or
pnpm dev:h5

# WeChat Mini Program
pnpm dev:mp-weixin

# Alipay Mini Program
pnpm dev:mp-alipay

# App (requires HBuilderX)
pnpm dev:app

# Android
pnpm dev:app-android

# iOS
pnpm dev:app-ios
```

### 3. Production Build

```bash
# H5 build
pnpm build:h5

# WeChat Mini Program build
pnpm build:mp-weixin

# App build
pnpm build:app

# View all build commands
pnpm run
```

## 📁 Project Structure

```
qc-admin-app/
├── env/                      # Environment config
├── scripts/                  # Scripts
├── src/                      # Source code
│   ├── components/          # Components
│   ├── config/              # App config
│   ├── hooks/               # Composition API hooks
│   ├── interceptors/        # Interceptors
│   ├── locale/              # i18n resources
│   ├── pages/               # Main package pages
│   ├── pages-sub/           # Sub-package pages
│   ├── service/             # API services
│   ├── static/              # Static assets
│   ├── store/               # State management
│   ├── style/               # Global styles
│   ├── utils/               # Utilities
│   ├── App.vue              # Root component
│   ├── main.ts              # App entry
│   ├── manifest.json        # App config
│   ├── pages.json           # Page config
│   └── uni.scss             # Global style variables
└── vite.config.ts            # Vite config
```

## 🎨 Features

### 1. Authentication

- ✅ Login/Register
- ✅ Password Recovery
- ✅ Verification Code Login
- ✅ OAuth (WeChat, Alipay, etc.)
- ✅ Token Management

### 2. User Center

- ✅ Profile Management
- ✅ Avatar Upload
- ✅ Password Change
- ✅ Security Settings
- ✅ Language Switching

### 3. Permission

- ✅ Role-based Access Control
- ✅ Page-level Permissions
- ✅ Button-level Permissions
- ✅ Dynamic Routing

### 4. File Management

- ✅ Image Upload
- ✅ File Preview
- ✅ Album Selection
- ✅ Camera Capture
- ✅ Compression

### 5. Real-time Communication

- ✅ WebSocket Connection
- ✅ Message Push
- ✅ Online Status
- ✅ Auto Reconnect
- ✅ Heartbeat

### 6. Data Sync

- ✅ Local Cache
- ✅ Offline Data
- ✅ Incremental Sync
- ✅ Data Persistence

## 📦 Dependencies

```json
{
  "dependencies": {
    "@dcloudio/uni-app": "^3.0.0",
    "vue": "^3.4.0",
    "pinia": "^2.1.0",
    "@vueuse/core": "^10.0.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@dcloudio/vite-plugin-uni": "^3.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "unocss": "^0.58.0"
  }
}
```

## 🎯 Development Guide

### Create Page

1. **Create page in pages directory**

```vue
<!-- src/pages/example/example.vue -->
<template>
  <view class="container">
    <text>{{ title }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Example Page')

onLoad(() => {
  console.log('Page loaded')
})
</script>
```

2. **Register in pages.json**

```json
{
  "pages": [
    {
      "path": "pages/example/example",
      "style": {
        "navigationBarTitleText": "Example"
      }
    }
  ]
}
```

### API Request

```typescript
// src/service/user.ts
import { http } from '@/utils/http'

export interface UserInfo {
  id: number
  username: string
  avatar: string
}

export const getUserInfo = (id: number) => {
  return http.get<UserInfo>(`/users/${id}`)
}

export const updateUserInfo = (id: number, data: Partial<UserInfo>) => {
  return http.put<UserInfo>(`/users/${id}`, data)
}
```

### State Management

```typescript
// src/store/modules/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
    token: uni.getStorageSync('token') || '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(username: string, password: string) {
      const { data } = await loginApi({ username, password })
      this.token = data.token
      uni.setStorageSync('token', data.token)
    },

    logout() {
      this.token = ''
      this.userInfo = null
      uni.removeStorageSync('token')
    },
  },
})
```

## 📱 Platform Features

### H5

- ✅ Modern browsers
- ✅ Responsive layout
- ✅ PWA support
- ✅ SEO optimization

### WeChat Mini Program

- ✅ WeChat login
- ✅ WeChat Pay
- ✅ Share
- ✅ Subscribe messages

### App (iOS/Android)

- ✅ Native performance
- ✅ Push notifications
- ✅ Local storage
- ✅ Camera access
- ✅ Geolocation

## 🔗 Links

### Documentation

- [uni-app Docs](https://uniapp.dcloud.io/)
- [Vue 3 Docs](https://vuejs.org/)
- [TypeScript Docs](https://www.typescriptlang.org/)

### Project Docs

- [Backend API Docs](../qc-admin-go-backend/README.md)
- [Web Admin Docs](../qc-admin/README.md)

### Tools

- [HBuilderX](https://www.dcloud.io/hbuilderx.html)
- [WeChat DevTools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

[MIT](./LICENSE)

## 👥 Maintainer

[@pqcqaq](https://github.com/pqcqaq)

---

⭐ Star us if this project helped you!
