import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { memoApi, type MemoResponse } from '@/api/client'

export const useMemoStore = defineStore('memo', () => {
  // State
  const memos = ref<MemoResponse[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const keyword = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isEmpty = computed(() => memos.value.length === 0)
  const totalPages = computed(() => Math.ceil(total.value / limit.value))

  // Actions
  /**
   * メモ一覧を取得
   */
  async function fetchMemos() {
    loading.value = true
    error.value = null
    try {
      const response = await memoApi.list(page.value, limit.value, keyword.value)
      memos.value = response.data
      total.value = response.total
      page.value = response.page
      limit.value = response.limit
    } catch (err: any) {
      error.value = err.response?.data?.message || 'メモの取得に失敗しました'
      console.error('Fetch memos error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * メモを作成
   */
  async function createMemo(text: string) {
    loading.value = true
    error.value = null
    try {
      const newMemo = await memoApi.create({ text })
      memos.value.unshift(newMemo)
      total.value++
      return newMemo
    } catch (err: any) {
      error.value = err.response?.data?.message || 'メモの作成に失敗しました'
      console.error('Create memo error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * メモを更新
   */
  async function updateMemo(id: string, text: string) {
    loading.value = true
    error.value = null
    try {
      const updatedMemo = await memoApi.update(id, { text })
      const index = memos.value.findIndex((m) => m.id === id)
      if (index !== -1) {
        memos.value[index] = updatedMemo
      }
      return updatedMemo
    } catch (err: any) {
      error.value = err.response?.data?.message || 'メモの更新に失敗しました'
      console.error('Update memo error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * メモを削除
   */
  async function deleteMemo(id: string) {
    loading.value = true
    error.value = null
    try {
      await memoApi.delete(id)
      memos.value = memos.value.filter((m) => m.id !== id)
      total.value--
    } catch (err: any) {
      error.value = err.response?.data?.message || 'メモの削除に失敗しました'
      console.error('Delete memo error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * ページを変更
   */
  function setPage(newPage: number) {
    page.value = newPage
  }

  /**
   * キーワード検索
   */
  function setKeyword(newKeyword: string) {
    keyword.value = newKeyword
    page.value = 1
  }

  /**
   * エラーをクリア
   */
  function clearError() {
    error.value = null
  }

  return {
    // State
    memos,
    total,
    page,
    limit,
    keyword,
    loading,
    error,
    // Computed
    isEmpty,
    totalPages,
    // Actions
    fetchMemos,
    createMemo,
    updateMemo,
    deleteMemo,
    setPage,
    setKeyword,
    clearError,
  }
})
