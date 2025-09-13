import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UserInfo, UserResult } from '@/api'

const userInfoState: UserInfo = {
  id: '',
  name: '',
  avatar: '',
  status: '',
  createTime: '',
  updateTime: '',
  roles: [],
  permissions: [],
  sex: 'unknown',
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<UserInfo>({ ...userInfoState })
    const token = ref<string | null>(null)
    // 设置用户信息
    const setLoginResult = (res: UserResult) => {
      userInfo.value = res.data.user
      token.value = res.data.token
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
    }
    const logout = () => {
      removeUserInfo()
      uni.navigateTo({ url: import.meta.env.VITE_LOGIN_URL })
    }

    return {
      userInfo,
      setUserAvatar,
      logout,
      token,
      setLoginResult,
    }
  },
  {
    persist: true,
  },
)
