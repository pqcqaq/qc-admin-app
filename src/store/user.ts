import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from '@/utils/toast'
import { IUser } from '@/api'
import { login as _login } from '@/api'

const userInfoState: IUser = {
  id: 0,
  customerOrganizationId: 0,
  phoneNumber: '',
  nickname: '',
  name: '',
  role: '',
  password: '',
  shopIdList: '',
  enabled: 0,
  gender: 2, // 1男，0女，2未填写
  avatarUrl: '',
  webSid: '',
  logined: 0,
  employeeStringId: '',
  created: 0,
  updated: 0,
  deleted: 0,
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<IUser>({ ...userInfoState })
    const token = ref<string | null>(null)
    // 设置用户信息
    const setUserInfo = (val: IUser) => {
      console.log('设置用户信息', val)
      // 若头像为空 则使用默认头像
      if (!val.avatarUrl) {
        val.avatarUrl = userInfoState.avatarUrl
      } else {
        val.avatarUrl = 'http://qiniuyun.ling-shun.com/avatar-default.png'
      }
      userInfo.value = val
    }
    const setUserAvatar = (avatar: string) => {
      userInfo.value.avatarUrl = avatar
      console.log('设置用户头像', avatar)
      console.log('userInfo', userInfo.value)
    }
    // 删除用户信息
    const removeUserInfo = () => {
      userInfo.value = { ...userInfoState }
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('token')
    }
    /**
     * 用户登录
     * @param credentials 登录参数
     * @returns R<IUserLogin>
     */
    const login = async (credentials: { accountName: string; password: string }) => {
      return _login(credentials).then((res) => {
        console.log('登录信息', res)
        toast.success('登录成功')
        setUserInfo(res.data)
        token.value = res.data.sid || ''
        return res
      })
    }

    const logout = () => {
      removeUserInfo()
      toast.success('退出登录成功')
      // uni.navigateTo({ url: '/pages/login/login' })
    }

    return {
      userInfo,
      login,
      setUserAvatar,
      logout,
      token,
    }
  },
  {
    persist: true,
  },
)
