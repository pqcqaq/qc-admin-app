import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from '@/utils/toast'
import { getUserDetailWithShop, IUser, UserInfoWithShop } from '@/api'
import { login as _login } from '@/api'

const userInfoState: UserInfoWithShop = {
  row: {
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
  } as any,
  shops: [],
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<UserInfoWithShop>({ ...userInfoState })
    const token = ref<string | null>(null)
    // 设置用户信息
    const setUserInfo = (val: UserInfoWithShop) => {
      console.log('设置用户信息', val)
      // 若头像为空 则使用默认头像
      if (!val.row.avatarUrl) {
        val.row.avatarUrl = userInfoState.row.avatarUrl
      } else {
        val.row.avatarUrl = 'http://qiniuyun.ling-shun.com/avatar-default.png'
      }
      userInfo.value = val
    }
    const setUserAvatar = (avatar: string) => {
      userInfo.value.row.avatarUrl = avatar
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
      return _login(credentials)
        .then((res) => {
          console.log('登录信息', res)
          toast.success('登录成功')
          token.value = res.data.sid || ''
          return res
        })
        .then((res) => {
          return getUserDetailWithShop({
            id: res.data.id,
          })
        })
        .then((res) => {
          console.log('获取用户信息', res)
          setUserInfo(res.data)
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
