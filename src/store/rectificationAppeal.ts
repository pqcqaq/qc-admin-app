import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useRectificationAppealStore = defineStore('rectificationAppeal', () => {
  const item = ref<any>(null)
  const totalCount = ref(0)
  const checkedCount = ref(0)
  return { item, totalCount, checkedCount }
})
