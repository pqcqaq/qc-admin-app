import {
  type MessageHandler,
  SocketClient,
  type UnsubscribeFunction,
} from 'qc-admin-api-common/socket'
import { createUniAppAdapter } from 'qc-admin-api-common/adaptor/uniapp'
import { defineStore } from 'pinia'
import { onMounted, onUnmounted, type Ref, ref } from 'vue'
import { useUserStore } from './user'

export const useSocketStore = defineStore('socket', () => {
  const socketClient = ref<SocketClient | null>(null)

  const start = () => {
    if (!import.meta.env.VITE_SOCKET_URL) {
      console.warn('socket is not enabled')
      return
    }
    if (socketClient.value) {
      socketClient.value.connect()
      return
    }
    const userStore = useUserStore()
    let serverUrl = import.meta.env.VITE_SOCKET_URL
    //// #ifndef H5
    serverUrl = import.meta.env.VITE_SOCKET_SERVER
    // #endif
    socketClient.value = new SocketClient({
      url: serverUrl,
      token: userStore.token?.accessToken || '',
      debug: true,
      heartbeatInterval: 45000,
      adapter: createUniAppAdapter(),
      refreshToken: () => {
        const userStore = useUserStore()
        return userStore
          .handRefreshToken({
            refreshToken: userStore.token?.refreshToken || '',
          })
          .then((res) => {
            if (res.success && res.data.token) {
              userStore.token = res.data.token
              return res.data.token.accessToken
            }
            throw new Error(res.data.message || '刷新token失败')
          })
      },
      errorHandler: (msg) => {
        console.error('WebSocket error:', msg)
      },
    })
    socketClient.value.connect()
  }

  return {
    start,
    connect: start,
    hookOnMounted: (...params) => {
      const dispose: Ref<UnsubscribeFunction | null> = ref(null)

      // 清理之前的订阅（如果存在）
      const cleanup = () => {
        if (dispose.value) {
          dispose.value()
          dispose.value = null
        }
      }

      onMounted(() => {
        // 先清理可能存在的旧订阅
        cleanup()
        if (!socketClient.value) {
          console.warn('socketClient is not initialized')
          return
        }
        dispose.value = socketClient.value.subscribe(...params)
      })

      onUnmounted(() => {
        cleanup()
      })
    },
    subscribe: (...params) => {
      if (!socketClient.value) {
        console.warn('socketClient is not initialized')
        return
      }
      return socketClient.value.subscribe(...params)
    },
    unsubscribe: (...params) => {
      if (!socketClient.value) {
        console.warn('socketClient is not initialized')
        return
      }
      return socketClient.value.unsubscribe(...params)
    },
    unsubscribeAll: () => {
      if (!socketClient.value) {
        console.warn('socketClient is not initialized')
        return
      }
    },
    sendMessage: (...params) => {
      if (!socketClient.value) {
        console.warn('socketClient is not initialized')
        return
      }
      return socketClient.value.sendMessage(...params)
    },
    disConnect: () => {
      if (!socketClient.value) {
        console.warn('socketClient is not initialized')
        return
      }
      return socketClient.value.disconnect()
    },
  } satisfies {
    start: () => void
    connect: () => void
    subscribe: SocketClient['subscribe']
    unsubscribe: SocketClient['unsubscribe']
    unsubscribeAll: SocketClient['unsubscribeAll']
    hookOnMounted: <T>(topic: string, handler: MessageHandler<T>) => void
    sendMessage: SocketClient['sendMessage']
    disConnect: SocketClient['disconnect']
  }
})
