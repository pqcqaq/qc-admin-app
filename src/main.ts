import '@/style/index.scss'
import { VueQueryPlugin } from '@tanstack/vue-query'
import 'uno.css'
import { createSSRApp } from 'vue'

import App from './App.vue'
import { prototypeInterceptor, requestInterceptor, routeInterceptor } from './interceptors'
import i18n from './locale/index'
import store from './store'

// 初始化公共API客户端
import { initHttpClient, setClientCode } from 'qc-admin-api-common'
import { http } from '@/utils/http'

// 初始化HTTP客户端
// @ts-ignore 类型兼容性问题，这里忽略类型检查
initHttpClient(http)
setClientCode(import.meta.env.VITE_CLIENT_CODE || '')

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(i18n)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(prototypeInterceptor)
  app.use(VueQueryPlugin)

  return {
    app,
  }
}
