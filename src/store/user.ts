import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UserInfo, UserResult, TokenInfo, refreshTokenApi } from 'qc-admin-api-common/auth'
import { useSocketStore } from './socket'

const userInfoState: UserInfo = {
  id: '',
  name: '',
  avatar: '',
  status: '',
  createTime: '',
  updateTime: '',
  roles: [],
  permissions: [],
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<UserInfo>({ ...userInfoState })
    const token = ref<TokenInfo | null>(null)
    // 设置用户信息
    const setLoginResult = (res: UserResult) => {
      userInfo.value = res.data.user
      token.value = res.data.token
    }

    // 刷新token
    const handRefreshToken = (data?: { refreshToken: string }) => {
      return refreshTokenApi(data).then((res) => {
        if (res.success && res.data.token) {
          token.value = res.data.token
          return res
        }
        throw new Error(res.data.message || '刷新token失败')
      })
    }

    const checkAccessToken = (): Promise<boolean> => {
      return new Promise((resolve) => {
        if (!token.value) {
          resolve(false)
          return
        }
        const now = new Date().getTime()
        const expired = token.value.accessExpiredIn - now <= 0
        if (!expired) {
          resolve(true)
          return
        }
        // accessToken过期，尝试刷新
        handRefreshToken({ refreshToken: token.value.refreshToken })
          .then(() => {
            resolve(true)
          })
          .catch(() => {
            resolve(false)
          })
      })
    }

    // 获取token信息
    const getToken = () => {
      if (!token.value) return null
      const now = new Date().getTime()
      return {
        accessToken: token.value.accessToken,
        expires: token.value.accessExpiredIn,
        refreshToken: token.value.refreshToken,
        avatar: userInfo.value.avatar,
        username: userInfo.value.name,
        nickname: userInfo.value.name,
        roles: userInfo.value.roles,
        permissions: userInfo.value.permissions,
      }
    }
    const setUserAvatar = (avatar: string) => {
      userInfo.value.avatar = avatar
      console.log('设置用户头像', avatar)
      console.log('userInfo', userInfo.value)
    }
    //删除用户信息
    const removeUserInfo = () => {
      userInfo.value = { ...userInfoState }
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('token')
      token.value = null
    }
    const logout = () => {
      removeUserInfo()
      const socketStore = useSocketStore()
      uni.navigateTo({ url: import.meta.env.VITE_LOGIN_URL })
    }

    watch(
      token,
      (newToken, oldToken) => {
        if (newToken && newToken !== oldToken) {
          // token 存在且发生变化 -> 连接 WebSocket
          console.log('Token changed, connecting WebSocket...')
          const socketStore = useSocketStore()
          socketStore.connect()
        } else if (!newToken && oldToken) {
          // token 被清空 -> 断开 WebSocket
          console.log('Token cleared, disconnecting WebSocket...')
          const socketStore = useSocketStore()
          socketStore.disConnect()
        }
      },
      { immediate: true },
    ) // immediate: true 会在初始化时立即执行

    return {
      userInfo,
      setUserAvatar,
      logout,
      token,
      setLoginResult,
      handRefreshToken,
      checkAccessToken,
      getToken,
    }
  },
  {
    persist: true,
  },
)
