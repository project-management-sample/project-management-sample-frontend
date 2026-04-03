import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))

  // Computed
  const isAuthenticated = computed(() => token.value !== null)

  // Actions
  /**
   * ログイン: メールアドレスとパスワードで認証し、トークンを保存
   */
  async function login(email: string, password: string): Promise<void> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password })
    const { accessToken, refreshToken: rt } = response.data

    token.value = accessToken
    refreshToken.value = rt
    localStorage.setItem('auth_token', accessToken)
    localStorage.setItem('refresh_token', rt)
  }

  /**
   * アクセストークンをリフレッシュ
   */
  async function refresh(): Promise<void> {
    if (!refreshToken.value) throw new Error('リフレッシュトークンがありません')

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken.value,
    })
    const { accessToken } = response.data

    token.value = accessToken
    localStorage.setItem('auth_token', accessToken)
  }

  /**
   * ログアウト: トークンを削除
   */
  function logout(): void {
    token.value = null
    refreshToken.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  return {
    token,
    isAuthenticated,
    login,
    refresh,
    logout,
  }
})
