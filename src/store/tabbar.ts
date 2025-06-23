import { defineStore } from 'pinia'
import { tabList } from '@/config/tabbar'

export const useTabbarStore = defineStore('tabbar', {
  state: () => ({
    selectedIndex: 0,
    tabBarWidth: 375, // 默认屏幕宽度
    isAnimating: false, // 标记是否正在动画中
    animationTimer: null as number | null, // 动画计时器
  }),

  getters: {
    // 计算高亮条位置
    highlightPosition: (state) => {
      const itemWidth = state.tabBarWidth / tabList.length
      const centerPosition = state.selectedIndex * itemWidth + itemWidth / 2
      return centerPosition - 15 // 15为高亮条宽度的一半
    },
  },

  actions: {
    // 设置选中的tab索引
    setSelectedIndex(index: number, withAnimation = true) {
      if (this.selectedIndex !== index) {
        // 清除之前的计时器
        if (this.animationTimer) {
          clearTimeout(this.animationTimer)
          this.animationTimer = null
        }

        this.isAnimating = withAnimation
        this.selectedIndex = index

        // 动画完成后重置标记
        if (withAnimation) {
          this.animationTimer = setTimeout(() => {
            this.isAnimating = false
            this.animationTimer = null
          }, 300) // 与CSS动画时间保持一致
        }
      }
    },

    // 设置tabbar宽度
    setTabBarWidth(width: number) {
      if (this.tabBarWidth !== width) {
        this.tabBarWidth = width
      }
    },

    // 根据页面路径更新选中状态
    updateSelectedIndexByRoute(route: string) {
      const index = tabList.findIndex((item) => {
        const pagePath = item.pagePath.startsWith('/') ? item.pagePath.slice(1) : item.pagePath
        const currentRoute = route.startsWith('/') ? route.slice(1) : route
        return pagePath === currentRoute
      })

      if (index !== -1 && this.selectedIndex !== index) {
        // 如果是通过路由变化更新，不需要动画
        this.setSelectedIndex(index, false)
      }
    },

    // 强制停止动画（用于页面重新渲染时）
    stopAnimation() {
      if (this.animationTimer) {
        clearTimeout(this.animationTimer)
        this.animationTimer = null
      }
      this.isAnimating = false
    },
  },
})
