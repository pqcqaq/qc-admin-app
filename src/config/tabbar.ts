export interface TabItem {
  iconPath: string
  selectedIconPath: string
  pagePath: string
  text: string
}

// 从pages.json导入的tabbar配置
export const tabBarConfig = {
  color: '#999999',
  selectedColor: '#018d71',
  backgroundColor: '#F8F8F8',
  borderStyle: 'black',
  height: '50px',
  fontSize: '10px',
  iconWidth: '24px',
  spacing: '3px',
}

export const tabList = [
  {
    iconPath: '/static/tabbar/home.png',
    selectedIconPath: '/static/tabbar/homeHL.png',
    pagePath: 'pages/index/index',
    text: '',
  },
  {
    iconPath: '/static/tabbar/History.png',
    selectedIconPath: '/static/tabbar/HistoryHL.png',
    pagePath: 'pages/about/about',
    text: '',
  },
  {
    iconPath: '/static/tabbar/Category.png',
    selectedIconPath: '/static/tabbar/CategoryHL.png',
    pagePath: 'pages/mine/index',
    text: '',
  },
] satisfies [TabItem, TabItem, TabItem]
