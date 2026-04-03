import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export interface MemoResponse {
  id: string
  userId: string
  text: string
  createdAt: string
}

export interface CreateMemoRequest {
  text: string
}

export interface UpdateMemoRequest {
  text: string
}

export interface FindMemosResponse {
  data: MemoResponse[]
  total: number
  page: number
  limit: number
}

export interface ErrorResponse {
  error_code: string
  message: string
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// リクエストインターセプター（認証トークンを追加）
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// レスポンスインターセプター（エラーハンドリング）
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const memoApi = {
  /**
   * メモ一覧取得
   */
  async list(page: number = 1, limit: number = 20, keyword?: string) {
    const response = await apiClient.get<FindMemosResponse>('/memos', {
      params: { page, limit, keyword },
    })
    return response.data
  },

  /**
   * メモ作成
   */
  async create(request: CreateMemoRequest) {
    const response = await apiClient.post<MemoResponse>('/memos', request)
    return response.data
  },

  /**
   * メモ更新
   */
  async update(id: string, request: UpdateMemoRequest) {
    const response = await apiClient.patch<MemoResponse>(
      `/memos/${id}`,
      request
    )
    return response.data
  },

  /**
   * メモ削除
   */
  async delete(id: string) {
    await apiClient.delete(`/memos/${id}`)
  },
}

export default apiClient
