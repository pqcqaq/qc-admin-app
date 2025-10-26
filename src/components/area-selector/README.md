# 地理位置选择组件 (AreaSelector)

基于 uniapp 的级联地理位置选择组件,支持省市区街道的多级选择。

## 功能特性

- ✅ 支持多级地理位置选择(省/市/区/街道)
- ✅ 懒加载数据,按需加载下级地区
- ✅ 支持限制选择级别
- ✅ 支持选择任意级别(不必选到最后一级)
- ✅ 支持禁用状态
- ✅ 支持自定义占位符
- ✅ 原生实现,无需额外依赖
- ✅ v-model 双向绑定

## 安装

组件位于 `@/components/area-selector/` 目录下,已自动注册,可直接使用。

## 基础用法

```vue
<template>
  <AreaSelector
    v-model="selectedArea"
    v-model:current="currentArea"
    placeholder="请选择地区"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedArea = ref<string[]>([])
const currentArea = ref<string>('')

const handleChange = (ids: string[], currentId: string) => {
  console.log('选中的ID数组:', ids)
  console.log('当前最后一级ID:', currentId)
}
</script>
```

## Props

| 属性          | 类型     | 默认值       | 说明                                            |
| ------------- | -------- | ------------ | ----------------------------------------------- |
| modelValue    | string[] | []           | v-model 绑定的地区ID列表                        |
| current       | string   | ''           | v-model:current 绑定的当前最后一级地区ID        |
| maxLevel      | number   | undefined    | 选择级别限制,如设置为3表示最多选择到第3级(city) |
| parentAreaId  | string   | ''           | 限制在某个地区下的子项选择                      |
| checkStrictly | boolean  | false        | 是否可以选择任意一级,不必选到最后一级           |
| placeholder   | string   | '请选择地区' | 占位符                                          |
| disabled      | boolean  | false        | 是否禁用                                        |

## Events

| 事件名            | 参数                               | 说明                 |
| ----------------- | ---------------------------------- | -------------------- |
| change            | (ids: string[], currentId: string) | 选择变化时触发       |
| update:modelValue | (ids: string[])                    | v-model 更新         |
| update:current    | (currentId: string)                | v-model:current 更新 |

## 使用示例

### 1. 限制选择级别

只允许选择到市级:

```vue
<AreaSelector v-model="selectedArea" :max-level="3" placeholder="最多选到市级" />
```

级别映射:

- 0: country (国家)
- 1: province (省份)
- 2: city (城市)
- 3: district (区县)
- 4: street (街道)

### 2. 允许选择任意级别

用户可以只选择省份,不必选到最后一级:

```vue
<AreaSelector v-model="selectedArea" :check-strictly="true" placeholder="可选择任意级别" />
```

### 3. 限制在某个地区下选择

只显示某个省份下的城市:

```vue
<AreaSelector v-model="selectedArea" parent-area-id="110000" placeholder="只显示北京市下的区县" />
```

### 4. 禁用状态

```vue
<AreaSelector v-model="selectedArea" :disabled="true" />
```

## API 依赖

组件依赖 `qc-admin-api-common/area` 模块中的以下 API:

- `getAreasByParentId(parentId: string)`: 根据父级ID获取下一级地区

确保后端服务已正确实现该 API。

## 测试页面

项目提供了完整的测试页面,展示了各种使用场景:

路径: `/pages/area-selector-demo/index`

可以通过 about 页面的"跳转地理位置选择测试"按钮进入。

## 样式定制

组件使用了 SCSS 变量,可以通过修改 `@/style/variables.scss` 来自定义样式:

- `$bg-gray`: 背景色
- `$bg-white`: 白色背景
- `$font-primary`: 主要文字颜色
- `$font-gray`: 次要文字颜色
- `$radius-xl`: 圆角大小
- `$shadow-normal`: 阴影效果

## 注意事项

1. 组件使用原生弹窗实现,不依赖 uni-popup 等第三方组件
2. 数据采用懒加载方式,减少初始加载时间
3. 支持所有 uniapp 平台(H5/小程序/App)
4. 当 `parentAreaId` 变化时,会自动清空已选择的内容

## 与 Admin 端对比

该组件是参考 admin 端的 `AreaSelector` 组件实现的,主要区别:

| 特性     | Admin 端              | App 端   |
| -------- | --------------------- | -------- |
| 基础组件 | Element Plus Cascader | 原生实现 |
| 弹窗方式 | 下拉菜单              | 底部弹窗 |
| 搜索功能 | 支持                  | 暂不支持 |
| 多选     | 可扩展                | 暂不支持 |
| 平台兼容 | Web                   | 全平台   |

## License

MIT
